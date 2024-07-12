import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import chatSearch from './assets/messagesearch.png';

const ChatList = ({ array }) => {
  const { signout } = useContext(AuthContext);

  return (
    <div className='chats'>
      <div className='chats-header'>
        <h1>Chats</h1>
        <button onClick={signout}>Exit</button>
      </div>
      <div className='chats-search'>
        <img src={chatSearch} alt="chatSearch" />
        <input placeholder='Search messenger...' type="text" />
      </div>
      <ul id="list">
        {array.map((item) => (
          <li key={item.name}>
            <NavLink activeClassName="active" to={`/chat/${item.name}`}>
              <img src={item.image} alt={item.name} />
              <div>
                <h4>{item.name}</h4>
                <p>Message from {item.name}</p>
              </div>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
