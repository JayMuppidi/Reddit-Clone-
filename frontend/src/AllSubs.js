/* eslint-disable no-unused-vars */
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
  InputGroup,
  List,
  ListItem,
  Stack,
  Tab,
  TabList,
  Spinner,
  TabPanel,
  TabPanels,
  Flex,
  Input,
  InputLeftElement,
  Tabs,
  Text,
  useColorModeValue,
  useTheme
} from '@chakra-ui/react';
import { AiOutlineSearch } from "react-icons/ai";
import api from './api/api.js';
import {FaBookmark}  from "react-icons/fa"
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import NavBar from './navBar.js';
import jwtDecode from 'jwt-decode';
const AllSubs = () => {
  const [allsubsList, setallsubsList] = useState([]);
  const [searchQuery,setSearchQuery] = useState(['']);
 
  const nav = useNavigate();
  useEffect(()=>{
    if (!localStorage.getItem("user") || localStorage.getItem("user") === null) {
    nav("/")}
},[nav]);
const userId = jwtDecode(localStorage.getItem("authTok")).user.id
  useEffect(() => {
    async function fetcher() {
      const returnDeets = await api.get('api/greddits/allSubs');
      setallsubsList(returnDeets.data);
    }
    fetcher();
  }, []);
  

  const handleSearch = async (event) =>{
    event.preventDefault();
    try {
      const reply = await api.get('/api/greddits/search/'+searchQuery);
      setallsubsList(reply.data);
    } catch (error) {
      console.log(error);
    }
  };
 
  async function handleLeave(subID) {
    const userDeets = {
      "userId":userId
    }
    const reply = await api.put("/api/greddits/leave/"+subID,userDeets)
    window.location.reload(true)
  }

  function handleOpen(subID) {
    nav("/SpecSub/"+subID)
  }
 
 async function handleJoin(subID){
    const userDeets = {
      "userId":userId
    }
    const reply = await api.put("/api/greddits/join/"+subID,userDeets)
    console.log(reply.data)
  }

  function generateSubCards() {

    if (!allsubsList) {
      return (
        <Flex justify="center" align="center" height="80vh">
          <Spinner size="xl" />
        </Flex>
      );
    }
    return allsubsList.map((sub) => {
      const userStatus = sub.users.find((user) => user.userId === userId)?.status;
     
      const isMember = userStatus === 'member';
      const isModerator = userStatus === 'moderator';
      const isBlocked = userStatus === 'blocked';
      const isRequested = userStatus === 'requested';
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
         { <Image
          src={sub.imgUrl}
          alt = "Sub's image"
          boxSize="200px"
          objectFit="cover"
          />
         }
          <Text fontWeight="bold" mb={2}>
            Users: {sub.users.length}
          </Text>
          <Text fontWeight="bold" mb={2}>
            Posts: {sub.posts.length}
          </Text>
          <Text mb={2}>Description: {sub.description}</Text>
          <Text fontWeight="bold" mb={2}>
            Banned Keywords:
            {(sub.bannedKeywords) && sub.bannedKeywords.map((element, index) => {
                                return index === sub.banned.length - 1 ? element : element + ', ';
                            })}
          </Text>
          <Center>
          <HStack mt={4}>
            {isMember && (
              <Button colorScheme="red" onClick={() => handleLeave(sub._id)}>
                Leave
              </Button>
            )}
            {(userStatus===undefined) && (
              <Button colorScheme="blue" onClick={() => handleJoin(sub._id)}>
                Join
              </Button>
            )}
            {(userStatus==='isBlocked') && (
              <Text colorScheme="blue">
                You can't join as you're blocked or you've left the sub before
              </Text>
            )}
            {
              <Button onClick={() => handleOpen(sub._id)} isDisabled={isRequested||(userStatus===undefined)||isBlocked}>
               Open
             </Button>
               
            }
          </HStack>
          </Center>
        </Card>
      );
    });
  }
  const searchBar = (
    <form onSubmit={handleSearch}>
        <InputGroup size="lg">
          <InputLeftElement pointerEvents="none" children={<AiOutlineSearch />} />
          <Input
            type="text"
            placeholder="Search subgreddits"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </InputGroup>
      </form>
  )
  return (
    <ChakraProvider>
      
        {NavBar()}

        <Center mt={4}>
          <HStack>
          {searchBar}
          {generateSubCards()}
          </HStack>
          </Center>
      
    </ChakraProvider>
  );
};

export default AllSubs;