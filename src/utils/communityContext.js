import React from "react";

let context;

function getCommunityContext() {
  if(!context) {
    context = React.createContext(undefined);
  }

  return context;
}

export default getCommunityContext;