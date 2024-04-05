import React, { useEffect, useState } from "react";

function useLocalStorage(key, defaultVal) {
  const [val, setVal] = useState(() => {
    let currentVal;
    try {
      currentVal = JSON.parse(localStorage.getItem(key) || String(defaultVal));
    } catch (error) {
      console.log(error);
      currentVal = defaultVal;
    }
    return currentVal;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(val));
  }, [key, val]);
  return [val, setVal];
}

export default useLocalStorage;
