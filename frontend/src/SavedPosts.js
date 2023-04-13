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
    IconButton
  } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react'
import NavBar from './navBar.js'
import api from './api/api.js';
import jwtDecode from 'jwt-decode';
import { FaBookmark, FaUser, FaComment } from 'react-icons/fa';
import { Navigate,useNavigate } from 'react-router-dom';





const SavedPosts=()=>{
const[postsArr,setPostsArr]=useState([]);
const [uNamee,setuNamee] = useState('');
const userId = jwtDecode(localStorage.getItem("authTok"))?.user?.id
const nav = useNavigate();
useEffect(()=>{
  if (!localStorage.getItem("user") || localStorage.getItem("user") === null) {
  nav("/")}
},[nav]);
async function fetchData(){
    try{
    const reply = await api.get("api/post/savedPosts/"+userId);
    const postsWithUsernames = await Promise.all(
        reply.data.map(async (post) => {
          const uNamee = await getUsername(post.userId);
          const subName = await getgredditName(post.subgreddiitId);
          return { ...post, uNamee, subName };
        }));
        setPostsArr(postsWithUsernames)
    }
    catch(err)
    {
        console.log(err)
    }
}
fetchData()
async function getUsername(userId){
    const reply = await api.get("api/user/"+userId);
    return reply.data.uName;
}
async function getgredditName(subId){
    const reply = await api.get("api/greddits/"+subId);
    return reply.data.name;
}
function openComments(postId){
  nav("/Comments/"+postId);
}

function postList(){
    async function handleUnsave(postId){
        try {
            
            const unSaveDeets = {
              "postId":postId,
              "userId": userId
            }
           
            const reply = await api.post("api/post/unsavee",unSaveDeets)
            console.log("line 57: unsaved");
          } catch (error) {
            console.error(error);
            console.log(error)
          }
    }
    if (!postsArr&&postsArr.length===0) {
        return (
          <Flex justify="center" align="center" height="80vh">
            <Spinner size="xl" />
          </Flex>
        );
      }
    return (
        <HStack>
          {postsArr.map(post => 
          (
               <Card
            key={post._id}
            p={4}
            borderWidth={1}
            borderRadius={4}
            margin={2}
            boxShadow="lg"
            width="auto"
          > 
              <Text fontWeight="bold" mb={2}>Posted by: {post.uNamee}</Text>
              <Text fontWeight="bold" mb={2}>Posted in: {post.subName}</Text>
              <Text fontWeight="bold" mb={2}>Message:</Text>
              <Card p={4}
            borderWidth={1}
            borderRadius={4}
            margin={2}
            boxShadow="lg"
            width="auto">
              
              <Text mb={2}>{post.text}</Text>
              </Card>
              <Button
              leftIcon={<FaBookmark />}
              mr={2}
              width="auto"
              onClick={() => handleUnsave(post._id)}
              colorScheme="purple"
            > Unsave</Button>
           <Text fontWeight="bold" mb={2}
            >
             {post.upvotes} {"Upvotes"} 
              </Text>
              <Text fontWeight="bold" mb={2}
            >
             {post.downvotes} {"Downvotes"} 
              </Text>
            <Button colorScheme="orange" leftIcon={<FaComment />}onClick={() => openComments(post._id)}>
      Comment
    </Button>
                </Card>
          ))}
        </HStack>
      );
}


    return <ChakraProvider theme = {theme}>
        {NavBar()}
        {postList()}
        
    </ChakraProvider>
}
export default SavedPosts