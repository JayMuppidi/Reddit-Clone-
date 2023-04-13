/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
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
  useTheme,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import NavBar from './navBar.js';
import { FaSignOutAlt } from 'react-icons/fa';
import { CloseIcon, CheckIcon } from '@chakra-ui/icons';
import api from './api/api.js';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

export default function Modpage() {
  const nav = useNavigate();
  const toast = useToast();

  const { subID } = useParams();
  const [subDeets, setSubDeets] = useState();
  const [userDeets, setUserDeets] = useState();
  const [requesters, setRequesters] = useState([]);
  const [joinContent, setjoinContent] = useState([]);
  const [cancelBlocker,setcancelBlocker]=useState(false);
  //const [isLoading, setIsLoading] = useState(true);
  const [reportsList, setReportsList] = useState([]);
  const [stats, setStats] = useState(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const reply = await api.get(`api/greddits/${subID}`);
        setSubDeets(reply.data);
        const userRep = await api.get(`api/user/${reply.data.moderatorId}`);
        setUserDeets(userRep.data);
        if (
          !(
            userRep.data._id ===
            jwtDecode(localStorage.getItem('authTok')).user.id
          )
        ) {
          nav('/profile');
        }
      } catch (error) {
        console.log(error);
        console.error(error);
      }
    }
    fetchData();

    async function fetcher() {
      try {
        const response = await api.get('api/greddits/requestedUsers/' + subID);
        if (response.status === 200) {
          return response.data;
        } else {
          throw new Error('API request failed with status: ' + response.status);
        }
      } catch (error) {
        console.log(error);
        throw new Error('API request failed with error: ' + error.message);
      }
    }
    
   
      fetcher()
      .then(data => {
        setRequesters(data)
      })
     .catch (error => {
      console.log(error);
    })
    async function reportsFetcher(){
      try{
        const reply = await api.get("api/greddits/reports/"+subID)
        console.log(reply.data)
        return reply.data
      }
      catch(error)
      {
        console.log(error)
      }
    }
    
      reportsFetcher()
      .then(data2 => {
        setReportsList(data2)
        console.log(data2)
      })
      .catch(error => {
          console.log(error);
        });
    
  }, []);
  useEffect(() => {
    
  },[reportsList])

  function handleBack() {
    nav('/Mysubgreddits');
  }

  if (!localStorage.getItem('user') || localStorage.getItem('user') === null) {
    return <Navigate to="/" replace />;
  }
  //Joining Requests

  function requestList(users) {
    const acceptJoin = async userId => {
      try {
        const req = {
          userId: userId,
        };
        await api.put('/api/greddits/add/' + subID, req);

        toast({
          title: 'Join request accepted.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.log(error);
        toast({
          title: 'Error occurred.',
          description: 'Unable to accept join request. Please try again later.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    const rejectJoin = async userId => {
      try {
        const req = {
          userId: userId,
        };
        await api.put('/api/greddits/leave/' + subID, req);
        toast({
          title: 'Join request rejected.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.log(error);
        toast({
          title: 'Error occurred.',
          description: 'Unable to reject join request. Please try again later.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    return (
      <VStack p={4} borderRadius="md" boxShadow="md" backgroundColor="white">
        {users.map(user => (
          <Box key={user.userId} display="flex" alignItems="center" mb={2}>
            <HStack>
              <Text>{user.uName}</Text>
              <IconButton
                aria-label="Accept user"
                icon={<CheckIcon />}
                size="sm"
                onClick={() => acceptJoin(user._id)}
              />
              <IconButton
                aria-label="Reject user"
                icon={<CloseIcon />}
                size="sm"
                onClick={() => rejectJoin(user._id)}
              />
            </HStack>
          </Box>
        ))}
      </VStack>
    );
  }

   function reportsRender (reportsList) {
    if(reportsList===undefined)
    {
      return (
        
        <VStack justify="center" align="center" height="80vh">
            <Spinner size="xl" />
            <Text>No Reports right now</Text>
          </VStack>
      )
    }
    const handleReport = async (report, flag) => {
      if (flag === 0) {
        //block
        let message = '';
            const req = {
              userId: report.reporteeId._id,
            };
            console.log(req)
            try {
              const response = await api.put('/api/greddits/leave/' + subID, req);
              const blockedUser = response.data.blockedUser;
              message = `User ${blockedUser.username} has been blocked.`;
      
              toast({
                title: 'User Blocked',
                description: message,
                status: 'success',
                duration: 5000,
                isClosable: true,
              });
            } catch (error) {
              message = 'Failed to block user. Please try again later.';
              toast({
                title: 'Error',
                description: message,
                duration: 5000,
                isClosable: true,
        });
     
  }
}
      
      else if (flag === 1) //delete the post
      
      {
        console.log(report.postId)
        let message = ''
        try{
        api.delete('api/post/delete/'+report.postId._id);
        message = `The report has been deleted`;
  
          toast({
            title: 'Post deleted',
            description: message,
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          //window.location.reload();
        } catch (error) {
          message = 'Failed to delete post. Please try again later.';
          toast({
            title: 'Error',
            description: message,
            duration: 5000,
            isClosable: true,
    });
    }
  }
       else if (flag === 2) //ignore 
      {
        let message = '';
        try {
          const response = await api.get('/api/greddits/ignoreReport/' + report._id);
          message = `The report has been ignored`;
  
          toast({
            title: 'Report ignored',
            description: message,
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          window.location.reload();
        } catch (error) {
          message = 'Failed to ignore report. Please try again later.';
          toast({
            title: 'Error',
            description: message,
            duration: 5000,
            isClosable: true,
    });
       

      }
      }
    }
      
      return (
<HStack>
          {reportsList.map(report => (
           
               <Card
            key={report._id}
            p={4}
            borderWidth={1}
            borderRadius={4}
            margin={2}
            boxShadow="lg"
            width="auto"
          > 
              <Text fontWeight="bold" mb={2}>Reported by: {report.reporterId.uName}</Text>
              <Text fontWeight="bold" mb={2}>Concern:</Text>
              <Card p={4}
            borderWidth={1}
            borderRadius={4}
            margin={0.5}
            boxShadow="lg"
            width="auto">
              <Text  mb={2}>{report.concern}</Text>
              </Card>
              <Text fontWeight="bold" mb={2}>Post's text:</Text>
              <Card p={4}
            borderWidth={1}
            borderRadius={4}
            margin={0.5}
            boxShadow="lg"
            width="auto">
              <Text  mb={2}>{report.postId.text}</Text>
              </Card>
              <Text fontWeight="bold" mb={2}>Post by: {report.reporteeId.uName}</Text>
              <HStack>
             
          
              <Button colorScheme="orange"
               isDisabled={ report.status==="ignored"}
             onClick={() => handleReport(report,0)}
            >
      Block
    </Button>
            <Button
              aria-label="Delete"
              colorScheme="red"
              width="auto"
              mr={2}
              isDisabled={ report.status==="ignored"}
              onClick={() => handleReport(report,1)}
            >
              Delete
              </Button>
    <Button
              aria-label="Ignore"
              colorScheme="purple"
              width="auto"
              mr={2}
              onClick={() => handleReport(report,2)}
            >
              Ignore
              </Button>
              {cancelBlocker&&<Button onClick={setcancelBlocker(false)} colorScheme="red">
              Cancel
            </Button>}
              </HStack>
              <Text fontWeight="bold" mb={2}>Status: {report.status}</Text>
                </Card>
          ))}
        </HStack>

      )
  };

  return (
    <ChakraProvider>
      {NavBar()}
      <Tabs>
        <TabList>
          <Tab>Join requests</Tab>
          <Tab> Users</Tab>
          <Tab> Reports</Tab>
          <Tab>Stats</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>{requestList(requesters)}</TabPanel>

          <TabPanel></TabPanel>

          <TabPanel>{reportsRender(reportsList)}</TabPanel>

          <TabPanel>{/* Stats */}</TabPanel>
        </TabPanels>
      </Tabs>

      <Button
        rightIcon={<FaSignOutAlt />}
        colorScheme="blue"
        type="submit"
        onClick={handleBack}
      >
        Go back to MySubs
      </Button>
    </ChakraProvider>
  );
}
