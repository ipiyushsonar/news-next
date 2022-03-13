// Index

// Imports
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Toolbar } from "../components/toolbar";
import { useSession, signIn, signOut } from 'next-auth/react';

// Functional Component
export default function Home() {
  const { data: session } = useSession()
  if (session) {
		return (
			<div className='page-container'>
				{/* Toolbar */}
				<Toolbar />
				Signed in as {session.user.email} <br />
				<button onClick={() => signOut()}>Sign out</button>
				{/* Home Page Content */}
				<div className={styles.main}>
					<h1>Next.js News App</h1>
					<h3>Your one stop for the latest news.</h3>
				</div>
			</div>
		);
	}
	return (
		<div className='page-container'>
      <div className="navbar">
        <Toolbar />
        <button className="btn" onClick={() => signIn()}>Sign in</button>
      </div>
			<div className={styles.main}>
				<h1>Next.js News App</h1>
				<h3>Your one stop for the latest news.</h3>
				<h3>Not signed in, please login.</h3>
			</div>
		</div>
	);
}
