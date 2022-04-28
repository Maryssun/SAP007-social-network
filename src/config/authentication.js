import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged
} from "./export.js";
import { auth } from "./start-firebase.js";
// import { userCollection } from "./user.js";

export function registerNewUser(name, email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const userId = userCredential.user.uid;
      sendEmailVerification(auth.currentUser)
        .then(() => {
          // userCollection(name, email, userId);
          alert("Cadastro realizado com sucesso!");
          window.location.hash = "#feed";
        })
        .catch(() => {
          message.innerHTML = "Email de verificação não enviado!";
        });
    })
    .catch((error) => {
      switch (error.code) {
        case "auth/email-already-in-use":
          message.innerHTML = "Email já cadastrado! Escolha outro email.";
          break;
        case "auth/weak-password":
          message.innerHTML = "Sua senha deve ter no mínimo 6 caracteres.";
          break;
      }
    });
}

export function authUserLabFriends(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // const userName = userCredential.user.name;
      // const userId = userCredential.user.uid;
      window.location.hash = "#feed";
    })
    .catch((error) => {
      switch (error.code) {
        case "auth/user-not-found":
          message.innerHTML =
            "Usuário não encontrado! Crie um cadastro na LabFriends!";
          break;
        case "auth/wrong-password":
          message.innerHTML = "Autenticação inválida, verifica seu e-mail e senha!";
          break;
      }
    });
}

export function authUserWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      // const userName = result.user.displayName;
      // const userEmail = result.user.email;
      // const userId = credential.accessToken;
      // userCollection(userName, userEmail, userId);
      window.location.hash = "#feed";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
    });
}

export function logout() {
  return signOut(auth).then();
}

export function forgotPassword(email) {
  return sendPasswordResetEmail(auth, email);
}

export function authChange(cb) {
  return onAuthStateChanged(auth, (user) => {
    cb(user !== null);
  });
}
