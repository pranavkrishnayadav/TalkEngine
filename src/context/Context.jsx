import { createContext, useState } from "react";
import runChat from "../config/gemini";
export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setinput] = useState("");

  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);

  const [showResults, setshowresults] = useState(false);

  const [loading, setloading] = useState(false);

  const [resultdata, setresultdata] = useState("");


// const delaypara

const delepara = (index,nextword)=>{
    setTimeout(function(){
          setresultdata(prev => prev+nextword)
    },75*index)
}

const newchat = ()=>{
    setloading(false)
    setshowresults(false)
    
}
  const onSent = async (prompt) => {
    
     setresultdata("")
     setloading(true)
     setshowresults(true)
     let response;
     if (prompt !== undefined) {
       response = await runChat(prompt);
       setRecentPrompt(prompt);
     } else {
       setPrevPrompts((prev) => [...prev, input]);
       setRecentPrompt(input);
       response = await runChat(input);
     }
     
    //  setRecentPrompt(input)
    //  setPrevPrompts(prev=>[...prev,input])
    // const response = await runChat(input);
    let responsearray = response.split("**")
    let newResponse = "";
for (let i = 0; i < responsearray.length; i++) {
    if (i === 0 || i % 2 === 0) {
        newResponse += responsearray[i];
    } else {
        newResponse += "<b>" + responsearray[i] + "</b>";
    }
}
let newResponse2 = newResponse.split("*").join("<br>");

let newResponseArray = newResponse2.split(" ");

for(let i=0; i< newResponseArray.length;i++){
    const nextword = newResponseArray[i];
    delepara(i,nextword+" ")
}

setresultdata(newResponse2);

    setloading(false)
    setinput(" ")


  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResults,
    loading,
    resultdata,
    input,
    setinput,
    newchat
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
