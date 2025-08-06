
import noteContext from './noteContext';
import { useState } from 'react';

const NoteState = (props) => {
    
    const stud = {
        "name":"Vips",
        "class":"11 A"
    }

    const [state,setState] = useState(stud);

    const update = () => {
        setTimeout( () => {
            setState({
                    "name" : "Vipuls",
                    "class" : "12 A"
                })
        },2000);
    }

    return (
        <noteContext.Provider value={{state,update}}>
            {props.children}
        </noteContext.Provider>
    )
}

export default NoteState;
