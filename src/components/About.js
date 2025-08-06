import React, { useContext,useEffect } from 'react'
import noteContext from '../context/notes/noteContext'

const About = () => {

   const A = useContext(noteContext);
   
   useEffect(() => {
    A.update();
    // eslint-disable-next-line
    }, []);
  return (
    <div>
        This is About {A.state.name} and He is in Class {A.state.class}
    </div>
  )
}

export default About
