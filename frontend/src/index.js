import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Layout from './App';
import Profile from './Profile';
import SavedPosts from "./SavedPosts";
import ErrorPage from './ErrorPage'
import Comments from './Comments.js'
import Login from './Login'
import SpecSub from './SpecSub.js'
import Mysubgreddits from './Mysubgreddits.js'
import Allsubs from './AllSubs.js'
import Modpage from './Modpage.js'
import reportWebVitals from './reportWebVitals';
import { useEffect } from "react";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LoginWithRedirect />} />
          <Route path="Profile" element={<Profile />} />
          <Route path="SavedPosts" element={<SavedPosts />} />
          <Route path="Mysubgreddits" element={<Mysubgreddits />} />
          <Route path="Allsubs" element={<Allsubs />} />
          <Route path="SpecSub/:subID" element={<SpecSub />} />
          <Route path="Modpage/:subID" element={<Modpage />} />
          <Route path="Comments/:postId" element={<Comments />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function LoginWithRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/");
    }
  }, [navigate]);

  return <Login />;
}

const root = document.getElementById('root');
ReactDOM.render(<App />, root);

reportWebVitals();
