import React from 'react'
import { Link } from "react-router-dom";

function Header() {
    return (
      <div>
            <Link to="/new">회원가입</Link>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Link to="/manage">관리 페이지</Link>
            
            <br/>
            <Link to="/login">로그인 페이지</Link>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Link to="/normal">공용 페이지</Link>
            <Link to="/follow">내 팔로우 보기</Link>
      </div>
    )
  }
  
  export default Header;