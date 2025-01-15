import { Link, Outlet } from "react-router-dom";
import styles from "./Navigation.module.css";
import { logout } from "../../../http";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../../../store/authSlice";

const Navigation = () => {
  const brandStyle = {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "22px",
    display: "flex",
    alignItems: "center",
  };

  const logoText = {
    marginLeft: "10px",
  };

  const dispatch = useDispatch();
  const { isAuth, user } = useSelector((state) => state.auth);

  const logoutUser = async () => {
    try {
      const { data } = await logout();
      dispatch(setAuth({ user: data.user }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <nav className={`${styles.navbar} container`}>
        <Link style={brandStyle} to={"/"}>
          <img src="/images/logo.png"></img>
          <span style={logoText}>Talkify</span>
        </Link>
        
        {
          isAuth && <div className={styles.navRight}>
          <h3>{user?.name}</h3>
          <Link to="/">
            <img className={styles.avatar} src={user.avatar ? user.avatar : '/images/monkey-avatar.png'} alt="avatar" />
          </Link>
          <button className="logoutButton" onClick={logoutUser}>
            <img src="/images/logout.png" width="30" height="30" alt="logout" />
          </button>
        </div>
        }
      </nav>
      <Outlet />
    </div>
  );
};

export default Navigation;
