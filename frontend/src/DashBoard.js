import React from 'react';

const imageUrl = "https://www.publicdomainpictures.net/pictures/180000/velka/dinosaur-3-1464225334MLv.jpg"


const Dashboard = ({ onLogout }) => {
  return (
    <div className='dashboard'>
      <h1>Dashboard</h1>

      <p>Hello There.<br /> IT'S A DINOSAUR</p>
      <img 
        className="exampleImage"
        src={imageUrl}
        alt={'dinosaurs'}
      ></img>
      
      <button onClick={onLogout}>Log Out</button>
    </div>
  );
};

export default Dashboard;
