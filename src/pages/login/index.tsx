// import { useState, SyntheticEvent } from "react";
// import { useRouter } from "next/router";
// import { signIn } from "next-auth/client";

// import {
//   AuthSection,
//   Login,
//   ControlItem,
//   ControlLable,
//   ControlInput,
//   SubmitButtonWrapper,
//   SubmitButton,
// } from "./index.style";

// const LoginForm = () => {
//   // 使用者的狀態與登入邏輯...

//   return (
//     <AuthSection>
//       <Login>Login</Login>
//       <form onSubmit={handleSubmit}>
//         <ControlItem>
//           <ControlLable htmlFor="email">Your Email</ControlLable>
//           <ControlInput
//             type="email"
//             id="email"
//             required
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </ControlItem>
//         <ControlItem>
//           <ControlLable htmlFor="password">Your Password</ControlLable>
//           <ControlInput
//             type="password"
//             id="password"
//             required
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </ControlItem>
//         <SubmitButtonWrapper>
//           <SubmitButton type="submit">Login</SubmitButton>
//         </SubmitButtonWrapper>
//       </form>
//     </AuthSection>
//   );
// };

// export default LoginForm;
