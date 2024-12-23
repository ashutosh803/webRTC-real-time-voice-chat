import React from "react";
import styles from "./Home.module.css";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/shared/Card/Card";
import Button from "../../components/shared/Button/Button";

const Home = () => {
  const signInLinkStyle = {
    color: 'rgb(35, 35, 211)',
    fontWeight: 'bold',
    textDecoration: 'none',
    marginLeft: '10px'
  }

  const navigate = useNavigate()

  const startRegister = () => {
    navigate("/register")
  }

  return (
    <div className={styles.cardWrapper}>
      <Card title="Welcome to Talkify" icon="logo">
        <p className={styles.text}>
          We're working hard to get Talkify ready for everyone! While we wrap up
          the finishing touches, we are adding people gradually to make sure
          nothing breaks
        </p>
        <div>
          <Button onClick={startRegister} text={"Get your username"} />
        </div>
        <div className={styles.signinWrapper}>
          <span className={styles.hasInvite}>Have an invite text?</span>
          <Link to={"/login"} style={signInLinkStyle}>Sign in</Link>
        </div>
      </Card>
    </div>
  );
};

export default Home;
