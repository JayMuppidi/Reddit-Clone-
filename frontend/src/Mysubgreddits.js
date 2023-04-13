/* eslint-disable no-unused-vars */
import React, { useState,useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import {
  Box,
  Button,
  Card,
  Center,
  ChakraProvider,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  Flex,
  InputGroup,
  List,
  ListItem,
  Stack,
  VStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Spinner,
  Tabs,
  Text,
  useColorModeValue,
  useTheme
} from '@chakra-ui/react';
import NavBar from './navBar.js';
import api from './api/api.js';
import { Navigate,useNavigate } from 'react-router-dom';
const Mysubgreddits = () => {
    //for subgreddit creation
  const [name, setName] = useState('');
  const [createMode,setCreateMode] = useState(false);
  const [description, setDescription] = useState('');
  const [tagStr, settagStr] = useState('');
  
  
  const [bannedKeyStr, setbannedKeyStr] = useState('');
  const [imageFile, setImageFile] = useState(null);
  

  // to display my subgrediiits

  const [subList,setSubList]= useState([]);
  const [dataList,setdataList]= useState([]);
  const [displayList,setdisplayList]=useState([]);
  const theme = useTheme();
  const nav = useNavigate();
  async function handleDelete(subID){
    const reply = await api.delete("api/greddits/delete/"+subID);
    fetchData()
}
function handleOpen(subID){
  nav("/Modpage/"+subID)
}
useEffect(()=>{  
fetchData();
},[]);
  
    useEffect(()=>{
        if (!localStorage.getItem("user") || localStorage.getItem("user") === null) {
        nav("/")}
    },[nav]);
    
 
    async function fetchData() {
    try {
      const userId = jwtDecode(localStorage.getItem("authTok"))?.user?.id;
      const reply = await api.get("api/user/" + userId);
      if (!reply?.data?.subgreddiits) {
        console.log("Subgreddiits data is undefined or null.");
        return;
      }
      setSubList(reply.data.subgreddiits);
    
      const moderatorSubs = reply.data.subgreddiits.filter(sub => sub.status === "moderator");
      if(moderatorSubs === null)
      {
        console.log("Subgreddiits data is undefined or null.");
        return;
      }
      const moderatorSubsWithData = await Promise.all(moderatorSubs.map(async (sub) => {
        const subReply = await api.get("api/greddits/" + (sub.subgreddiitId ?? ""));
        return subReply?.data ?? null;
      }));
      setdataList(moderatorSubsWithData.filter(data => data !== null));
    }catch(error){
      console.log(error)
    }
     
    }
    

    function generateSubCards() {
      if (!dataList) {
        return (
          <Flex justify="center" align="center" height="80vh">
            <Spinner size="xl" />
          </Flex>
        );
      }
    
      return dataList.map(sub => {
        return (
          <Card
            key={sub._id}
            p={4}
            borderWidth={1}
            borderRadius={4}
            margin={2}
            boxShadow="lg"
          >
            <Heading as="h2" size="lg" mb={2}>
              {sub.name}
            </Heading>
            <Text fontWeight="bold" mb={2}>
              Users: {sub.users.length}
            </Text>
            <Text fontWeight="bold" mb={2}>
              Posts: {sub.posts.length}
            </Text>
            <Text mb={2}>Description: {sub.description}</Text>
            <Text fontWeight="bold" mb={2}>
              Banned Keywords: {sub.bannedKeywords ? sub.bannedKeywords.join(", ") : ""}
            </Text>
            <HStack mt={4}>
              <Button colorScheme="red" onClick={() => handleDelete(sub._id)}>
                Delete
              </Button>
              <Button onClick={() => handleOpen(sub._id)}>Open</Button>
            </HStack>
          </Card>
        );
      });
    }
  async function handleSubmit(event) {
    event.preventDefault();
    const tagArr = tagStr.split(","," ")
    const bannedArr = bannedKeyStr.split(","," ")
    const subDeets = {
    "name":name,
    "description":description,
    "moderatorId": jwtDecode(localStorage.getItem("authTok")).user.id,
    "tags": tagArr.length > 0 ? tagArr : null,
    "bannedWords": bannedArr.length > 0 ? bannedArr : null,
    "imgUrl": "https://i.imgur.com/tI1fzaf.jpeg"
    }
    

    const reply = await api.post("api/greddits/create",subDeets);
    fetchData()
    setName('')
    setDescription('');
   settagStr('');
   setbannedKeyStr('');
   setImageFile(null);
   setCreateMode(false)
    
  }
  const createButton = (
    <Button onClick={() => setCreateMode(true)}>
            Create New Subgreddiit
          </Button>
  )
  const createForm = (
    <Card
      p={4}
      borderRadius="md"
      boxShadow="md"
      bg={useColorModeValue('gray.100', 'gray.700')}
    >
      <Heading mb = {3}>Create Sub Greddiit</Heading>
      <FormControl mb = {3} isRequired>
        <FormLabel>Name</FormLabel>
        <Input type="text" value={name}   onChange={(event) => setName(event.target.value)} />
      </FormControl>
      <FormControl mb = {3}>
        <FormLabel>Description</FormLabel>
        <Input
          as="textarea"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </FormControl>
      <FormControl mb = {3}>
        <FormLabel>Tags (seperated by commas)</FormLabel>
        <Input
          as="textarea"
          value={tagStr}
          onChange={(event) => settagStr(event.target.value)}
        />
      </FormControl>
      <FormControl mb = {3}>
        <FormLabel>Banned Keywords(seperated by commas)</FormLabel>
        <Input
          as="textarea"
          value={bannedKeyStr}
          onChange={(event) => setbannedKeyStr(event.target.value)}
        />
      </FormControl>
      <FormControl mb = {3}>
        <FormLabel>Image</FormLabel>
        <Input type="file"   onChange={(event) => setImageFile(event.target.files[0])}/>
      </FormControl>
      <Button colorScheme="blue" type="submit"
      onClick={handleSubmit}
      isDisabled={!(name)}
      
      >
        Create Sub Greddiit
      </Button>
      <Button onClick={() => setCreateMode(false)}>
            Cancel
          </Button>
    </Card>
  );
  return (
    <ChakraProvider >
      <Stack bg={useColorModeValue('gray.50', 'gray.800')} p={4}>
        {NavBar()}
        
        <Center mt={4}>
          <VStack>
          {createMode&&createForm}
          <HStack>
          {generateSubCards()}
          </HStack>
          
          {(!createMode)&&createButton}
          </VStack>
          </Center>
      </Stack>

    </ChakraProvider>
  );
};

export default Mysubgreddits;