import { Box, Stack, Text, Image } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import AuthLayout from "../../AuthLayout/Index";
import Input from "../../Components/Input";
import { MdEmail } from "react-icons/md";
import Seo from "../../Utils/Seo";
import { RiLockPasswordFill } from "react-icons/ri";
import Button from "../../Components/Button";
import { FaArrowRightLong } from "react-icons/fa6";
import ShowToast from "../../Components/ToastNotification";
import { ProviderLoginApi } from "../../Utils/ApiCalls";
import { useNavigate } from "react-router-dom";
import logo from "../../Assets/carelogo.png";
import { jwtDecode } from "jwt-decode";
import UpdateUserPasswordModal from "../../Components/UpdateUserPasswordModal";

export default function SignIn() {
  const [Payload, setPayload] = useState({
    email: "",
    password: "",
  });
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });
  const [Loading, setLoading] = useState(false);
  const [onlineUser, setOnlineUser] = useState(null);
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);
  // Make token reactive.
  const [token, setToken] = useState('');
  const nav = useNavigate();

  const handlePayload = (e) => {
    setPayload({ ...Payload, [e.target.id]: e.target.value });
  };

  const Proceed = async () => {
    setLoading(true);
    try {
      const result = await ProviderLoginApi(Payload);
      console.log("Signin API response:", result);

      if (result.status === 200) {
        setLoading(false);
        const token = result.data.queryresult.token;
        localStorage.setItem("token", token);
        setToken(token);
        const decodedUser = jwtDecode(token).user;
        setOnlineUser(decodedUser);
        localStorage.setItem("onlineUser", JSON.stringify(decodedUser));

        // Check if a password update is required.
        if (result.data.requirepasswordchange) {
          localStorage.setItem("requirePasswordChange", "true");
          setShowUpdatePasswordModal(true);
          setShowToast({
            show: true,
            message: "Please update your password.",
            status: "warning",
          });
          
          setTimeout(() => {
            setShowToast({ show: false, message: "", status: "" });
          }, 3000);
        } else {
          // Mark no password change is needed.
          localStorage.setItem("requirePasswordChange", "false");
          setShowToast({
            show: true,
            message: "Login successful! Redirecting...",
            status: "success",
          });
          setTimeout(() => {
            setShowToast({ show: false, message: "", status: "" });
            localStorage.setItem("email", Payload.email);
            localStorage.setItem("password", btoa(Payload.password));
            nav("/dashboard");
          }, 3000);
        }
      }
    } catch (e) {
      console.log("errorX", e.message);
      setLoading(false);
      setShowToast({
        show: true,
        message: e.message,
        status: "error",
      });
      setTimeout(() => {
        setShowToast({ show: false, message: "", status: "" });
      }, 4000);
    }
  };

  // Auto-redirect for users coming back with an existing token.
  // Check the stored flag "requirePasswordChange". Only auto-redirect if it is "false".
  useEffect(() => {
    const storedRequirePasswordChange = localStorage.getItem("requirePasswordChange");
    if (token && storedRequirePasswordChange === "false") {
      setShowToast({
        show: true,
        message: "Already Logged In! Redirecting...",
        status: "success",
      });
      setTimeout(() => {
        nav("/dashboard");
      }, 3000);
    }
  }, [token, nav]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      Proceed();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [Payload]);

  return (
    <AuthLayout>
      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}
      <Seo title="Sign-in" />
      <Box px={["3%", "3%", "15%", "15%"]} mt="32px">
        <Image src={logo} w="30%" />
        <Text mt="32px" fontWeight={"500"} fontSize={"26px"} color="#fff">
          Welcome back !
        </Text>
        <Stack mt="32px" spacing={"22px"}>
          <Input
            labelBg="#A069BA"
            bColor="#ddd"
            id="email"
            color="#fff"
            onChange={handlePayload}
            value={Payload.email}
            val={Payload.email !== ""}
            label="Email or Username"
            type="email"
            leftIcon={<MdEmail />}
          />
          <Input
            color="#fff"
            bColor="#ddd"
            labelBg="#A069BA"
            id="password"
            onChange={handlePayload}
            value={Payload.password}
            val={Payload.password !== ""}
            label="Password"
            type="password"
            leftIcon={<RiLockPasswordFill />}
          />
        </Stack>
        <Text
          textTransform={"capitalize"}
          fontWeight={"400"}
          fontSize={"13px"}
          mt="13px"
          textAlign={"right"}
          cursor={"pointer"}
          _hover={{ color: "blue.blue500", fontWeight: "500" }}
          color="#fff"
        >
          Forgot Password?
        </Text>
        <Button
          mt="32px"
          rightIcon={<FaArrowRightLong />}
          isLoading={Loading}
          onClick={Proceed}
          disabled={Payload.email === "" || Payload.password === ""}
        >
          Login
        </Button>
      </Box>
      {showUpdatePasswordModal && onlineUser && (
        <UpdateUserPasswordModal
          isOpen={showUpdatePasswordModal}
          onClose={() => setShowUpdatePasswordModal(false)}
          userId={onlineUser._id}
          tempToken={token}
          onSuccess={() => {
            // When password update succeeds, clear the flag and redirect.
            localStorage.setItem("requirePasswordChange", "false");
            setShowUpdatePasswordModal(false);
            nav("/dashboard");
          }}
        />
      )}
    </AuthLayout>
  );
}
