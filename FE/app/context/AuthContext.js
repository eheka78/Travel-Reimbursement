import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  console.log("DDDDDDDDDD");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const [user, setUser] = useState(null); // 로그인 사용자 정보

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// 훅으로 쉽게 사용
export const useAuth = () => useContext(AuthContext);
