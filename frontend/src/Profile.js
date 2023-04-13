/* eslint-disable no-unused-vars */
import logo from './profilepic.jpg'
import axios from 'axios';
import api from './api/api.js'
import NavBar from './navBar.js'
import jwtDecode from 'jwt-decode';
import { CloseIcon } from "@chakra-ui/icons";
import React, { useState,useEffect } from 'react'
import {  useNavigate } from "react-router-dom";
import { 
  Image, 
  Heading, 
  HStack, 
  Text, 
  TabList, 
  TabPanels, 
  AlertIcon,
  TabPanel,
  Tab, 
  Tabs, 
  theme, 
  ListItem, 
  Button,
  ChakraProvider,
  Box,
  FormControl,
  Flex,
  LeftIcon,
  FormLabel,
  Input,
  Stack,
  VStack,
  InputGroup,
  Card,
  Center,
  Grid,
  Spinner,
  CardBody,
  IconButton
} from '@chakra-ui/react';
import './profile.css'

const Profile =  () => {
     const [userDeets,setUserDeets]=useState(null);
     const [efName,setefName]=useState();
     const [elName,setelName]=useState();
     const [ingList,setingList]=useState([]);
     const [werList,setwerList]=useState([]);
     const [eage,seteAge]=useState();
     const [eemail,seteEmail]=useState();
     const [ephoneNo,setePhone]=useState();
     const [ingNum,setingNum]=useState(0);
     const [werNum, setwerNum]=useState(0);
     const [editMode, setEditMode] = useState(false);
  const nav = useNavigate();
  useEffect(()=>{
    if (!localStorage.getItem("user") || localStorage.getItem("user") === null) {
    nav("/")}
},[nav]);
//if 0 then its followers
//if its 1 then its following
function UserList(users,flag) {
  if(!users.length)
  {
    return
  }
  async function handleUnfollow (userId){
      if(flag){
        const deets={
          "requesterId":userDeets._id
        }
        await api.put("/api/user/unfollow/"+userId,deets)
        window.location.reload(true)
      }

      if(!flag){
        const deets={
          "requesterId":userId
        }
        await api.put("/api/user/unfollow/"+userDeets._id,deets)
        window.location.reload(true)
      }
  };

  return (
    <Box p={4} borderRadius="md" boxShadow="md" backgroundColor="white">
      {users.map((user) => (
        <Box key={user.userId} display="flex" alignItems="center" mb={2}>
          <Button
            aria-label="Unfollow user"
            rightIcon = {<CloseIcon/>}
            size="sm"
            onClick={() => handleUnfollow(user._id)}
          >
            {user.uName}
          </Button>
        </Box>
      ))}
    </Box>
  );
}
  async function editSubmit(){
    
    const updatedDeets = {
      "id":userDeets._id,
      "fName": efName,
      "lName": elName,
      "email": eemail,
      "age": eage,
      "phoneNo": ephoneNo,
    };
    try{ 
      const reply = await api.post("api/user/edit", updatedDeets);
       
        if(reply.status ===200) 
        {
        setefName(reply.data.fName)
        setelName(reply.data.lName)
        seteAge(reply.data.age)
        seteEmail(reply.data.email)
        setePhone(reply.data.phoneNo)
        } 
        
    }
    catch (error){console.log(error)}

    setEditMode(false)

  }
  const editClicked = () => {
    setefName(userDeets.fName)
        setelName(userDeets.lName)
        seteAge(userDeets.age)
        seteEmail(userDeets.email)
        setePhone(userDeets.phoneNo)
    setEditMode(true)
  }  
    const hashedTok = localStorage.getItem("authTok");
    const userTok = jwtDecode(hashedTok);
    if(userTok)
    {
      async function fetchData() {
        const reply = await api.get("api/user/" + userTok.user.id);
        setUserDeets(reply.data)
        
        if(reply.data.followers.length)
        {
          setwerNum(reply.data.followers.length)
          const replyy = await api.get("/api/user/followers/"+userDeets._id)
          const werList= replyy.data
          setwerList(werList)
          console.log(werList)
          
        }
        
        if(reply.data.following.length)
        {
          setingNum(reply.data.following.length)
          const replyye = await api.get("/api/user/following/"+userDeets._id)
          const ingList = replyye.data
          setingList(ingList)
          
          
          
        }
        
      }
      fetchData();
    } 
    else {
      nav("/");
    }
    const disIng = UserList(ingList,1);
   const disWer =  UserList(werList,0);
    const editPart = (
      <ChakraProvider theme= {theme}>
        <HStack>
          <Box>
            <FormControl id="firstName" isRequired>
              <FormLabel>First Name</FormLabel>
              <Input
                type="text"
                bg="#e6f8ff"
                size="sm"
                borderRadius="8px"
                value={efName}
                onChange={(event) => setefName(event.target.value)}
              />
            </FormControl>
          </Box>
          <Box>
            <FormControl id="lastName" isRequired>
              <FormLabel>Last Name</FormLabel>
              <Input
                type="text"
                bg="#e6f8ff"
                size="sm"
                borderRadius="8px"
                value={elName}
                onChange={(event) => setelName(event.target.value)}
              />
            </FormControl>
          </Box>
        </HStack>
        <FormControl id="email" isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            bg="#e6f8ff"
            size="sm"
            borderRadius="8px"
            value={eemail}
            onChange={(event) => seteEmail(event.target.value)}
          />
        </FormControl>
        <HStack>
          <FormControl id="age" isRequired>
            <FormLabel>Age</FormLabel>
            <Input
              type="text"
              bg="#e6f8ff"
              size="sm"
              borderRadius="8px"
              value={eage}
              onChange={(event) => seteAge(event.target.value)}
            />
          </FormControl>
          <FormControl id="contact" isRequired>
            <FormLabel>Contact Number</FormLabel>
            <Input
              type="text"
              bg="#e6f8ff"
              size="sm"
              borderRadius="8px"
              value={ephoneNo}
              onChange={(event) => setePhone(event.target.value)}
            />
          </FormControl>
          <Button
                onClick={editSubmit}
              isDisabled={!(eemail&&ephoneNo&&efName&&elName&&eage)}
                >
                Change
              </Button>
        </HStack>
      </ChakraProvider>
    );
    function profileee() {
      if (!userDeets) {
        return (
          <Flex justify="center" align="center" height="80vh">
            <Spinner size="xl" />
          </Flex>
        );

      }
      return (
        <Box
          rounded={'lg'}
          bg= 'white'
          h = "100vh"
          boxShadow={'lg'}
          align='center'
          p={8}
          > 
          <HStack justifyContent='center'
            mb={3}>
          <VStack justifyContent='center'
            mb={3}>

          
        <HStack display='flex' justifyContent='center'>
          <Image
            rounded='full'
            htmlHeight='50px'
            htmlWidth='50px'
            src={logo}
            alt='profile picture'
            mt={5}
            mb={3}
          />
          <Heading as='h2' mt={5}
            mb={3}>
           {userDeets.fName} {userDeets.lName}
          </Heading>
        </HStack>
        <Text textAlign='center' mb={5}>
          age:{userDeets.age}
        </Text>
        <Text textAlign='center' mb={5}>
          Username: {userDeets.uName}
        </Text>
        <Text textAlign='center' mb={5}>
          Email Address: {userDeets.email}
          
        </Text>
        <Text textAlign='center' mb={5}>
          Contact : {userDeets.phoneNo}
          
        </Text>
        </VStack>
        {!editMode&&<Button onClick={() => editClicked()}>
            Edit
          </Button>}
          {editMode&&<Button onClick={() => setEditMode(false)}>
            Cancel
          </Button>}
          </HStack>
        <Box as='ul' textAlign='center' mt={5}
            mb={3}>
          <Box as='li' display='inline-block' mr={5}>
            <Text fontWeight='bold'>Followers</Text>
            <Text mb={5}>{werNum}</Text>
          </Box>
          <Box as='li' display='inline-block' mr={5}>
            <Text fontWeight='bold'>Following</Text>
            <Text mb={5} >{ingNum}</Text>
          </Box>
          <Box as='li' display='inline-block'>
            <Text fontWeight='bold'>Posts</Text>
            <Text mb={5}>0</Text>
          </Box>
        </Box>
        <Box
          rounded={'lg'}
          bg= 'white'
          w = '25%'
          boxShadow={'lg'}
          p={8}
          > 
        <Tabs >
          <TabList justifyContent='center'>
            <Tab>Followers</Tab>
            <Tab>Following</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
            <VStack>
      {disWer}
           </VStack>
             
            </TabPanel>
            <TabPanel>
            <VStack>
            {disIng}
          </VStack>
           
            </TabPanel>

          </TabPanels>
        </Tabs>
        </Box>
        
        </Box>
      )
    
    }
  
    const profileVar = profileee()
  return (
    <ChakraProvider theme={theme}>
      {NavBar()}
      
      {editMode&&editPart}
      {profileVar}
    </ChakraProvider>
  )
}

export default Profile

