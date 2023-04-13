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
import { FaArrowDown, FaArrowUp, FaBookmark, FaSignOutAlt, FaUser, FaComment } from 'react-icons/fa';
import { Navigate,useNavigate, useParams } from 'react-router-dom';
const Comments= ()=>{
  const nav = useNavigate();
  const theme = useTheme();

    if (!localStorage.getItem("user") || localStorage.getItem("user") === null) {
    nav("/")}

const userId= jwtDecode(localStorage.getItem("authTok")).user.id;
const {postId} = useParams();
const [post,setPost] = useState([])
const [uNameee,setuNameee]=useState('')
const [subId,setSubId] = useState()
const [commentsArr,setCommentsArr]=useState([]);
const [createMode, setCreateMode]=useState(false)
const [content,setContent]=useState('')
// useEffect(() => {
//     console.log(post);
//   }, [post]);
// fetchData()
// async function getUsername(userId){
//    const reply = await api.get("api/user/"+userId);
//    console.log(reply.data.uName)
//     return reply.data.uName
//  }
async function getPost(){
    const ppost = await api.get("/api/post/"+postId)
    const postObj= ppost.data
    setPost(postObj)
    const reply = await api.get("api/user/"+postObj.userId);
    setuNameee (reply.data.uName)
    setSubId(ppost.data.subgreddiitId);
}
async function fetchData(){
    try{
        const reply = await api.get("api/post/comments/" + postId);
        setCommentsArr(reply.data)
    }
    catch(err){
        console.log(err)
    }
} getPost()
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
      const reply = await api.put("api/user/follow"+tobeFollowedId,follower)
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
    async function handleUpVote(postId) {
    try {
      const response = await api.put("api/post/upvote/"+postId)
      console.log(response.data);
    } catch (error) {
      console.error(error);
      console.log(error)
    }
  }

const postCard = (
   
       <Card
        key={post._id}
        p={4}
        borderWidth={1}
        borderRadius={4}
        margin={2}
        boxShadow="lg"
        width="auto"
      > 
          <Text fontWeight="bold" mb={2}>Posted by: {uNameee}</Text>
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
            </Card>);

async function handleCreate(event){
    event.preventDefault();
    const commentDeets = {
     "postId":postId,
     "userId":userId,
     "text":content
    }
    const reply = await api.post("api/comments/create",commentDeets)
    setCreateMode(false)
 
 }
 function handleBack(){
    nav("/SpecSub/"+subId)
 }
 const createButton = (
    <Button colorScheme="red" onClick={() => setCreateMode(true)}>
    Write Comment
  </Button>);
  const backButton = (
    <Button leftIcon={<FaSignOutAlt />} colorScheme="blue" onClick={() => handleBack()}>
    Back to Subgreddiit
  </Button>);
 const createCommentForm = (
    <Card
    p={4}
    borderRadius="md"
    boxShadow="md"
    bg={useColorModeValue('gray.100', 'gray.700')}
  >
    <Heading mb = {3}>Write a comment</Heading>
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
      Write Comment
    </Button>
    <Button onClick={() => setCreateMode(false)}>
          Cancel
        </Button>
  </Card>
);
//const posty = loadPost()
function commentList() {
    fetchData()
    getPost()
        if (!commentsArr) {
            return (
              <Flex justify="center" align="center" height="80vh">
                <Spinner size="xl" />
              </Flex>
            );
          }
    return (
      <HStack>
        {commentsArr.map(comment => (
         
             <Card
          key={comment._doc._id}
          p={4}
          borderWidth={1}
          borderRadius={4}
          margin={2}
          boxShadow="lg"
          width="auto"
        > 
            <Text fontWeight="bold" mb={2}>Posted by: {comment.uName}</Text>
            <Text fontWeight="bold" mb={2}>Message:</Text>
            <Card p={4}
          borderWidth={1}
          borderRadius={4}
          margin={2}
          boxShadow="lg"
          width="auto">
            <Text  mb={2}>{comment._doc.text}</Text>
            </Card>
          
              </Card>
        ))}
      </HStack>
    );
  
}
function loadChecker (){
if (!post) {
  return (
    <Flex justify="center" align="center" height="80vh">
      <Spinner size="xl" />
    </Flex>
  );
}
else {
  return postCard
}
}
return (
    <ChakraProvider>
        {NavBar()}
        {createMode&&createCommentForm}
       {loadChecker()}
        <VStack>
        {commentList()}
        {backButton}
        {!createMode&&createButton}
        </VStack>

    </ChakraProvider>
)

}
export default Comments