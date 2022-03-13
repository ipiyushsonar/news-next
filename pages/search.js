// Search

// Imports
import styles from "../styles/Home.module.css";
import Toolbar from "../components/toolbar";

// Functional Component
export const Search = () => (
  <div className="page-container">
    {/* Toolbar */}
    <Toolbar />

    {/* Home Page Content */}
    <div className={styles.main}>
      <h1>Search News</h1>
    </div>
  </div>
);

// Default Export
export default Search;
