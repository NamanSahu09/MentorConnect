import React from 'react'


// Navigation items

const navItems = [
  { name: "Home", path: "/dashboard", icon: <FaHome /> },
  { name: "Post", path: "/post", icon: <FaUserFriends /> },
  { name: "Meetings", path: "/meetings", icon: <FaCalendarAlt /> },
  { name: "Chat", path: "/chat", icon: <FaComments /> },
  { name: "Profile", path: "/profile", icon: <FaUserFriends /> },
];

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); 
  const [lastLogin, setLastLogin] = useState(null);




const leftBar = () => {
  return (
    <>
    
    
    </>
  )
}

export default leftBar