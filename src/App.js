
import './App.css';

const imageUrl = "https://www.publicdomainpictures.net/pictures/180000/velka/dinosaur-3-1464225334MLv.jpg"

function MyButton(){
  return (
    <button>I'm a button!</button>
  );
}

function App() {
  return (
    <div>
      <h1>Welcome to my app!</h1>
      <MyButton />

      <p>Hello There.<br /> IT'S A DINOSAUR</p>

      <img 
        className="exampleImage"
        src={imageUrl}
        alt={'dinosaurs'}
      ></img>
    </div>
  );
}

export default App;
