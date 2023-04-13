/* eslint-disable no-unused-vars */
import React, {useState, useEffect}from 'react';
import { Navigate } from "react-router-dom";
import axios from 'axios';
import api from './api/api.js'
import { GoogleLogin } from 'react-google-login';
import {
  ChakraProvider,
  Box,
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel,
  Button,
  FormControl,
  Flex,
  FormLabel,
  Input,
  Heading,
  Stack,
  VStack,
  HStack,
  InputGroup,
  Card,
  Center,
  Grid,
  theme,
  CardBody,
} from '@chakra-ui/react';

export default function Login() {
  const [errorMessages, setErrorMessages]= useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [contact, setContact] = useState('');
    const [uname, setUname] = useState('');
    const [password, setPassword] = useState('');
  
    
    const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

const proff = ( <Navigate replace to="/Profile" />);
  const errors = {
    uError: "invalid username",
    pError: "invalid password",
    uTaken: "This username has been taken",
    unkownE: "Sorry try again unkown error",
    assocE: "This email is not associated to any email",
  };
  
   
 const handleSignUp = async (event)=>{
    event.preventDefault();
    const userDeets = {
      "fName": firstName,
      "lName": lastName,
      "email": email,
      "uName": uname,
      "age": age,
      "phoneNo": contact,
      "pword": password
    };
    try{ 
    const reply = await api.post("api/auth/signup", userDeets);
     
      if(reply.status ===201) 
      {
        setIsSubmitted(true);
        localStorage.setItem("authTok",reply.data.token);
        localStorage.setItem("user", true);
      } 
      else 
      {
        setErrorMessages({name: "unkownE", message: errors.unkownE});
      }
  }
  catch (error){
    if(error.response.status ===401)
     {
      setErrorMessages({ name: "uTaken", message: errors.uTaken });
     }
     else if(error.response.status === 400)
     {
      const errorMessages = error.response.data.errors.map((error) => error.msg);
      setErrorMessages({ name: "generic", message: errorMessages });
     }
     else if(error.status===500)
     {
      setErrorMessages({ name: "unkownE", message: errors.unkownE });
     }
  }
 };


  
 const handleSubmit = async (event) => {
  //Prevent page reload

  event.preventDefault();
  try {
    var { uname, pass } = document.forms[0];
    const inpp = {
      "uName": uname.value,
      "pword": pass.value
    };
    const reply = await api.post("api/auth/login", inpp);
    if (reply.status === 200) {
      setIsSubmitted(true);
      localStorage.setItem("authTok", reply.data.token);
      axios.defaults.headers.common['x-auth-token'] = reply.data.token;
      localStorage.setItem("user", 'true');
    } 
  } catch (error) {
    if (error.response.status === 400) {
      setErrorMessages({ name: "uError", message: errors.uError });
    } else if (error.response.status === 401) {
      setErrorMessages({ name: "pError", message: errors.pError });
    } 
  }
};
const handleGoogleSuccess = async (response) => {
  //const { tokenId } = response;
  const tokenId = response.tokenId;
  try {
    const reply = await axios.post("/api/gAuth", { tokenId });
    if (reply.status === 200) {
      setIsSubmitted(true);
      localStorage.setItem("authTok", reply.data.token);
      axios.defaults.headers.common['x-auth-token'] = reply.data.token;
      localStorage.setItem("user", 'true');
    } 
    // Save the token to the local storage or context state
  } catch (error) {
     if (error.response.status === 400) {
      setErrorMessages({ name: "gError", message: errors.assocE });
    } 
    else {
      setErrorMessages({name: "gError", message: errors.unkownE});
    }
    
  }
 
};

const handleGoogleFailure = (response) => {
  //console.log(response);
  setErrorMessages({name: "gError", message: errors.unkownE});
};
    
    

      const renderForm = (
        <ChakraProvider theme={theme}>
        
        <Tabs >
    <TabList>
        <Tab>Register</Tab>
        <Tab>Login</Tab>
    </TabList>
    <TabPanels>
    <TabPanel>
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg="#00B8FB">
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
      <Heading color = '#FFA500' textAlign='center' > Gredditt </Heading>
        <Box
          rounded={'lg'}
          bg= 'white'
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="firstName" isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input type="text" 
                   bg = "#e6f8ff" 
                   size='sm'
                   borderRadius='8px'
                   value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName" isRequired>
                  <FormLabel>Last Name</FormLabel>
                  <Input type="text"
                  bg = "#e6f8ff" 
                  size='sm'
                  borderRadius='8px'
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                   />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" 
              bg = "#e6f8ff" 
              size='sm'
              borderRadius='8px'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              />
            </FormControl>
            <HStack>
            <FormControl id="age" isRequired>
              <FormLabel>Age</FormLabel>
              <Input type="text" 
              bg = "#e6f8ff" 
              size='sm'
              borderRadius='8px'
              value={age}
              onChange={(event) => setAge(event.target.value)}
              />
                </FormControl>
              <FormControl id="contact" isRequired>
              <FormLabel>Contact Number</FormLabel>
              <Input type="text" 
              bg = "#e6f8ff" 
              size='sm'
              borderRadius='8px'
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              />
            </FormControl>
            </HStack>
            <FormControl id="uname" isRequired>
              <FormLabel>Username</FormLabel>
              
              <Input type="text" 
              bg = "#e6f8ff" 
              size='sm'
              borderRadius='8px'
              value={uname}
              onChange={(event) => setUname(event.target.value)}
              />
              {renderErrorMessage("uTaken")}
                </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type= 'password'

                bg = "#e6f8ff" 
                size='sm'
                borderRadius='8px'
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                />
              </InputGroup>
              {renderErrorMessage("pError")}
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                type = "submit"
                size="lg"
                color= '#e6f8ff'
                _hover = {{bg:'#FFA500'}}
              _active = {{bg:'black'}}
              bg = 'grey'
                onClick={handleSignUp}
              isDisabled={!(uname&&password&&email&&contact&&firstName&&lastName&&age)}
                >
                Sign up
              </Button>
              {renderErrorMessage("generic")}
            </Stack>
          </Stack>
        </Box>
      </Stack>
      
    </Flex>
        
        </TabPanel>
        <TabPanel>
       
    
        <Box textAlign="center" fontSize="xl" bg = "#00B8FB" >
        <Center> 
          <Grid minH="100vh" p={3}>
            <Stack spacing = '4'>
            <VStack spacing='6' mt = '8'>
            <Heading color = '#FFA500'> Gredditt</Heading>
            </VStack>
              <Card 
              borderColor = '#005e80'
              maxW = '308px'>
                <CardBody>
                <form onSubmit={handleSubmit}> 
                  <Stack>
              <FormControl>
              <FormLabel margin = '5px'>Enter Username</FormLabel>
              <Input 
               bg = "#e6f8ff" 
               type = 'text' 
               size='sm'
               borderRadius='8px'
               name="uname"
               value={uname}
                  onChange={(event) => setUname(event.target.value)}
               />
               {renderErrorMessage("uError")}
              </FormControl>
              <FormControl>
              <FormLabel margin = '5px'>Enter Password</FormLabel>
              <Input 
               bg = "#e6f8ff" 
               type = 'password' 
               name="pass"
               size='sm'
               borderRadius='8px'
               value={password}
               onChange={(event) => setPassword(event.target.value)}
               />
               {renderErrorMessage("pass")}
              </FormControl>
              
              <Button
              color= '#e6f8ff'
              bg = 'grey'
              size = 'sm'
              type = 'submit'
              _hover = {{bg:'#FFA500'}}
              isDisabled={!(uname&&password)}
              _active = {{bg:'black'}}
              >
                Login
                </Button>
                </Stack>
                </form>
                <GoogleLogin
      clientId="136594722692-lp6ui1591t2uf6f4vrmjbmtk1bfvbn8s.apps.googleusercontent.com"
      buttonText="Login with Google"
      borderRadius='8px'
      margin = '10px'
      onSuccess={handleGoogleSuccess}
      onFailure={handleGoogleFailure}
      cookiePolicy={'single_host_origin'}
    />
        {renderErrorMessage("gError")}
                </CardBody>
              </Card>
              </Stack>
          </Grid>
          </Center>
             </Box>
            </TabPanel>
        </TabPanels>
        </Tabs>
      </ChakraProvider>


      );
  return (
    
    <div className="app">
      <div className="login-form">
      {isSubmitted ||localStorage.getItem("user")? proff : renderForm}
      </div>
    </div>
  );
};
//<div>User is successfully logged in</div>
    

