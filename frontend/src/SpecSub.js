/* eslint-disable no-unused-vars */
import { 
    Image, 
    Heading, 
    HStack, 
    Text, 
    TabList, 
    TabPanels, 
    TabPanel,
    Tab, 
    Tabs, 
    theme, 
    List, 
    ListItem, 
    Button,
    ChakraProvider,
    Box,
    FormControl,
    Flex,
    FormLabel,
    Input,
    Stack,
    VStack,
    InputGroup,
    Card,
    Center,
    Spinner,
    Grid,
    CardBody,
    IconButton,
    TagLeftIcon,
    useColorModeValue,
    ButtonLeftIcon,
    useTheme
  } from '@chakra-ui/react';
import NavBar from './navBar.js'
import jwtDecode from 'jwt-decode';
import React, { useState, useEffect } from 'react'
import api from './api/api.js';
import { FaArrowDown, FaArrowUp, FaBookmark, FaUser, FaComment } from 'react-icons/fa';
import {WarningTwoIcon} from '@chakra-ui/icons'
import { Navigate,useNavigate, useParams } from 'react-router-dom';
const SpecSub= ()=>{
  const nav = useNavigate();
  const theme = useTheme();
  useEffect(()=>{
    if (!localStorage.getItem("user") || localStorage.getItem("user") === null) {
    nav("/")}
},[nav]);
    const [createMode,setCreateMode]=useState(false)
    const [content,setContent]=useState('')
    const [uName, setuName]=useState('')
    const [subDeets,setsubDeets]=useState(null)
    const [postsArr,setpostsArr]=useState([])
    const [concern, setConcern]=useState('');
    const {subID} = useParams();
    const userId= jwtDecode(localStorage.getItem("authTok")).user.id;
    async function getUsername(userId){
      const reply = await api.get("api/user/"+userId);
      //console.log(reply.data.uName)
      return reply.data.uName
  }
  async function getBlockedStatus(userId){
    const deeters = {
      "subId":subID
    }
    const reply = await api.post("api/user/blockedStatus/"+userId,deeters);
    console.log(reply.data.isBlocked)
    return reply.data.isBlocked
}
    async function fetchData() {    
        try {
          const reply = await api.get("api/greddits/posts/" + subID);
          const suber = await api.get("api/greddits/" + subID);
          setsubDeets(suber.data)
          const postsWithuName = await Promise.all(reply.data.map(async(post)=>{
            const uName = await getUsername(post.userId)
            const isBlocked = await getBlockedStatus(post.userId)
            return {...post,uName, isBlocked };
          }))
          setpostsArr(postsWithuName)
        }
       catch(err)
      {
          console.log("line 45:"+err)
      }
  }
async function handleCreate(event){
   event.preventDefault();
   const postDeets = {
    "text":content,
    "userId":userId,
    "subgreddiitId":subID
   }
   const reply = await api.post("api/post/create",postDeets)
   setCreateMode(false)

}

    const createPostForm = (
        <Card
        p={4}
        borderRadius="md"
        boxShadow="md"
        bg={useColorModeValue('gray.100', 'gray.700')}
      >
        <Heading mb = {3}>Create a Post</Heading>
        <FormControl mb = {3} isRequired>
          <FormLabel>Message:</FormLabel>
          <Input
            as="textarea"
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
        </FormControl>
        <Button colorScheme="blue" type="submit"
        onClick={handleCreate}
        isDisabled={!content}
        
        >
          Create Post
        </Button>
        <Button onClick={() => setCreateMode(false)}>
              Cancel
            </Button>
      </Card>
    );
  
    
    function postList() {
      
      async function handleSave(postId) {
        try {
          const userId = jwtDecode(localStorage.getItem("authTok"))?.user?.id
          const saveDeets = {
            "postId":postId,
            "userId": userId
          }
         
          await api.post("api/post/savee",saveDeets)
          console.log("line 117: saved");
        } catch (error) {
          console.error(error);
          console.log(error)
        }
      }
      async function handleFollow(tobeFollowedId) {
        try {
          const follower = {
            "requester": userId
          }
          const reply = await api.put("/api/user/follow/"+tobeFollowedId,follower)
          console.log(reply)
        } catch (error) {
          console.error(error);
          console.log("line 139"+error)
        }
      }
      async function handleDownVote(postId) {
        try {
          const response = await api.put("api/post/downvote/"+postId)
          console.log(response.data);
        } catch (error) {
          console.error(error);
          console.log(error)
        }
      }
      async function handleReport(postId,reporteeId) {
        try {
          const reportDeets = {
            "reporterId": userId,
            "reporteeId": reporteeId,
            "concern": concern,
            "subgreddiitId": subID,
            "postId": postId,
          };

          const response = await api.put("api/greddits/addReport/",reportDeets)
          window.location.reload();
        } catch (error) {
          console.error(error);
          console.log(error)
        }
      }
        async function handleUpVote(postId) {
        try {
          const response = await api.put("api/post/upvote/"+postId)
          console.log(response.data);
        } catch (error) {
          console.error(error);
          console.log(error)
        }
      }
      function openComments(postId){
        nav("/Comments/"+postId);
      }
    
      return (
        <HStack>
          {postsArr.map(post => (
           
               <Card
            key={post._id}
            p={4}
            borderWidth={1}
            borderRadius={4}
            margin={2}
            boxShadow="lg"
            width="auto"
          > 
              <Text fontWeight="bold" mb={2}>Posted by: {(!post.isBlocked)&&post.uName}{(post.isBlocked)&&"Blocked User"}</Text>
              <Button
              leftIcon={<FaUser />}
              colorScheme = "messenger"
              width="auto"
              onClick={() => handleFollow(post.userId)}>Follow
                </Button>
              <Text fontWeight="bold" mb={2}>Message:</Text>
              <Card p={4}
            borderWidth={1}
            borderRadius={4}
            margin={2}
            boxShadow="lg"
            width="auto">
              <Text  mb={2}>{post.text}</Text>
              </Card>
              <Button
              leftIcon={<FaBookmark />}
              mr={2}
              width="auto"
              onClick={() => handleSave(post._id)}
              colorScheme="purple"
            > Save</Button>
           <Button
              leftIcon={<FaArrowUp />}
              colorScheme="green"
              width="auto"
              mr={2}
              onClick={() => handleUpVote(post._id)}
            >
             {post.upvotes} {"       Upvotes"} 
              </Button>
            <Button
              aria-label="Downvotes"
              colorScheme="red"
              width="auto"
              leftIcon={<FaArrowDown />}
              mr={2}
              onClick={() => handleDownVote(post._id)}
            >
              {post.downvotes} Downvotes
              </Button>
            <Button colorScheme="orange" leftIcon={<FaComment />}
             onClick={() => openComments(post._id)}
            >
      Comment
    </Button>
    <Button
              aria-label="Report"
              colorScheme="red"
              width="auto"
              leftIcon={<WarningTwoIcon/>}
              mr={2}
              onClick={() => handleReport(post._id,post.userId)}
              isDisabled = {!concern}
            >
              Report
              </Button>
              <FormControl mb = {3} isRequired>
          <FormLabel>Concern:</FormLabel>
          <Input
            as="textarea"
            value={concern}
            onChange={(event) => setConcern(event.target.value)}
          >{concern}</Input>
        </FormControl>
                </Card>
          ))}
        </HStack>
      );
    
  }

    function keyDeets(){
        fetchData()
        if (!subDeets||!postsArr) {
            return (
              <Flex justify="center" align="center" height="80vh">
                <Spinner size="xl" />
              </Flex>
            );
          }
          return <Card key={subDeets._id} p={4} borderWidth={1} borderRadius={4} margin={2} boxShadow="lg">
          
          <Center>
          <VStack mt={4}>
          { <Image
            src={subDeets.imgUrl}
            alt = "Sub's image"
            boxSize="200px"
            objectFit="cover"
            />
           }
          <Heading as="h2" size="lg" mb={2}>
            {subDeets.name}
          </Heading>
          
          <Text fontWeight="bold" mb={2}>Description: {subDeets.description}</Text>
          {createMode&&createPostForm}
          {(!createMode)&&createButton}
          </VStack>
          </Center>
        </Card>

    }
    const createButton = (
    <Button colorScheme="red" onClick={() => setCreateMode(true)}>
    Create Post
  </Button>);
   
    
    return <ChakraProvider>
        {NavBar()}
         {keyDeets()}
        <HStack>
        {postList()}
        </HStack>
        
    </ChakraProvider>
}
export default SpecSub