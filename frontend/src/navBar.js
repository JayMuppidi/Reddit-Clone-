/* eslint-disable no-unused-vars */
import { Navigate,useNavigate } from "react-router-dom";
import { Box, Link,Flex, Text, Button, IconButton } from "@chakra-ui/react"
import { FaUser, FaList, FaSignOutAlt, FaBookmark, FaBuffer } from "react-icons/fa"
import { useState, useEffect } from 'react';
//import { Navigate, useNavigate } from 'react-router-dom';

function Navbar() {
  const [route, setRoute] = useState(null);
 
  const nav = useNavigate();
  if (!localStorage.getItem("user") || localStorage.getItem("user") === null) {
        nav("/");
      }
  const handleProfile = () => {
    setRoute('/Profile');
  };
  document.addEventListener('keydown', (event) => {
    // Check if the "Ctrl" key is pressed along with the "S" key
    if (event.ctrlKey && event.key === 'p') {
      // Execute the save action
      handleProfile()
      // Prevent the default behavior of the "Ctrl + S" key combination
      event.preventDefault();
    }
    if (event.ctrlKey && event.key === 'h') {
      // Execute the save action
      handleMySubs()
      // Prevent the default behavior of the "Ctrl + S" key combination
      event.preventDefault();
    }
    if (event.ctrlKey && event.key === 's') {
      // Execute the save action
      handleSavedPosts()
      // Prevent the default behavior of the "Ctrl + S" key combination
      event.preventDefault();
    }
    if (event.ctrlKey && event.key === 'a') {
      // Execute the save action
      handleAllsubs()
      // Prevent the default behavior of the "Ctrl + S" key combination
      event.preventDefault();
    }
    if (event.ctrlKey && event.key === 'l') {
      // Execute the save action
      handleLogout()
      // Prevent the default behavior of the "Ctrl + S" key combination
      event.preventDefault();
    }



  });

  const handleMySubs = () => {
    setRoute('/Mysubgreddits');
  };

  const handleSavedPosts = () => {
    setRoute('/SavedPosts');
  };

  const handleAllsubs = () => {
    setRoute('/allSubs');
  };

  const handleLogout = () => {
    nav('/')
    window.location.reload(true);
    localStorage.removeItem('user');
    localStorage.removeItem('authTok');
  };

  useEffect(() => {
    if (route) {
      nav(route);
      setRoute(null);
    }
  }, [route,nav]);

  return (
    <Box bg={('white', 'gray.800')} px={4} boxShadow='md'>
      <Flex h={16} alignItems='center' justifyContent='space-between'>
        <Link to='/'>
          <Text fontSize='xl' fontWeight='bold' color={('blue.600', 'blue.300')}>
             Greddit
          </Text>
        </Link>
        <Box>
          <Button
            leftIcon={<FaBookmark />}
            aria-label='Saved Posts'
            onClick={handleSavedPosts}
            color='white'
            bg='transparent'
            _hover={{ bg: ('gray.200', 'gray.700') }}
          >Saved Posts</Button>
          <Button
            leftIcon={<FaBuffer />}
            aria-label='My Sub Greddits'
            color='white'
            bg='transparent'
            onClick={handleMySubs}
            _hover={{ bg: ('gray.200', 'gray.700') }}
          >My Sub Greddits</Button>
          <Button
            leftIcon={<FaUser />}
            aria-label='Profile'
            color='white'
            bg='transparent'
            onClick={handleProfile}
            _hover={{ bg: ('gray.200', 'gray.700') }}
          > Profile</Button>
         
          <Button
            leftIcon={<FaList />}
            color='white'
            bg='transparent'
            _hover={{ bg: ('gray.200', 'gray.700') }}
            onClick={handleAllsubs}
          >
            All Subgreddits
          </Button>
           <Button
            leftIcon={<FaSignOutAlt />}
            variant='solid'
            colorScheme='red'
            onClick={handleLogout}
            size='sm'
          >
            Logout
          </Button>
        </Box>
      </Flex>
    </Box>
  );
}

export default Navbar;

// function Navbar() {
//     const nav = useNavigate();
// //   if (!localStorage.getItem("user") || localStorage.getItem("user") === null) {
// //     nav("/");
// //   }
// console.log("navbarfunction")
//   const handleProfile= () => {
//     nav("/profile");
    
//   };

//   const handleMySubs = () => {
//     //history.push('/mysubgreddits');
//     nav("/mysubgreddits");
//     //return (<Navigate replace to="/mysubgreddits" />)
//   };

//   const handleSavedPosts = () => {
//     //history.push('/savedposts');
//     nav("/savedposts")
//     //return (<Navigate replace to="/savedposts" />)

//   };
//   const handleAllsubs = () => {
//    // history.push('/allSubs');
//    //return (<Navigate replace to="/allSubs" />)
//    nav("/allSubs");

//   };

//   const handleLogout = () => {
//     // Perform logout logic here, such as clearing user session
//     // Then redirect to login page
//     localStorage.removeItem("user");
//     localStorage.removeItem("authTok");
//     nav("/")
//   };
// return (
//   <Box bg={("white", "gray.800")} px={4} boxShadow="md">
//   <Flex h={16} alignItems="center" justifyContent="space-between">
//     <Link to="/">
//       <Text fontSize="xl" fontWeight="bold" color={("blue.600", "blue.300")}>Sub Greddits</Text>
//     </Link>
//     <Box>
//       <IconButton icon={<FaBookmark />} aria-label="Saved Posts" onClick={handleSavedPosts()}color="black" bg="transparent" _hover={{ bg: ("gray.200", "gray.700") }} />
//       <IconButton icon={<FaList />} aria-label="My Sub Greddits" color="black" bg="transparent" onClick={handleMySubs()} _hover={{ bg: ("gray.200", "gray.700") }} />
//       <IconButton icon={<FaUser />} aria-label="Profile" color="black" bg="transparent" onClick={handleProfile()}_hover={{ bg: ("gray.200", "gray.700") }} />
//       <Button leftIcon={<FaSignOutAlt />} variant="solid" colorScheme="red" onClick={handleLogout()} size="sm">Logout</Button>
//       <IconButton icon={(<i className="fas fa-sun"></i>)} aria-label="All Subgreddits" color="black" bg="transparent" _hover={{ bg: ("gray.200", "gray.700") }} onClick={handleAllsubs()} />
//     </Box>
//   </Flex>
// </Box>
// )
// };

// export default Navbar