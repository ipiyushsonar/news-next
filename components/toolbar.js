// Toolbar Component

// Imports
import { useRouter } from "next/router";
import styles from "../styles/Toolbar.module.css";

// Functional Component
export const Toolbar = () => {
  const router = useRouter();

  // Return
  return (
    <div className={styles.main}>
      <div onClick={() => router.push("/")}>Home</div>
      <div onClick={() => router.push("/feed/1")}>News</div>
      <div onClick={ () => router.push( "/search" ) }>Search</div>
      
      {/* <div
        onClick={() =>
          (window.location.href =
            "https://github.com/ipiyushsonar/next-news")
        }
      >
        GitHub
      </div> */}
    </div>
  );
};

// Default Export
export default Toolbar;
