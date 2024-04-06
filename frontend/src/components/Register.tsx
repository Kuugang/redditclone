import React from "react";
import { toast } from "react-toastify";

interface RegisterProps {
  handleCloseDialog: (ref: React.RefObject<HTMLDialogElement>) => void;
  registerRef: React.RefObject<HTMLDialogElement>;
}

const Register: React.FC<RegisterProps> = ({
  registerRef,
  handleCloseDialog,
}) => {
  async function handleRegister(e) {
    e.preventDefault();

    try {
      let inputs = new FormData();
      inputs.append("username", e.target.username.value);
      inputs.append("password", e.target.password.value);
      inputs.append("email", e.target.email.value);
      inputs.append("firstName", e.target.firstName.value);
      inputs.append("lastName", e.target.lastName.value);
      inputs.append("gender", e.target.gender.value);
      inputs.append("birthDate", e.target.birthDate.value);

      let data = await fetch("http://localhost:6969/api/user/register.php", {
        method: "POST",
        body: inputs,
        credentials: "include",
      });

      if (data.status == 200) {
        toast("Registered successfully");
        data = await data.json();
        handleCloseDialog(registerRef);
        e.target.reset();
      } else if (data.status == 409) {
        toast.error("Username already taken");
      }
    } catch (e) {
      toast.error(e.message);
    }
  }
  return (
    <>
      <dialog ref={registerRef}>
        <form
          onSubmit={(e) => handleRegister(e)}
          className="border rounded p-6 flex flex-col gap-1 w-[500px]"
        >
          <div className="flex flex-row justify-between">
            <h1 className="font-bold text-2xl">Register</h1>
            <button
              type="button"
              className="border rounded-full px-2 py-1 bg-zinc-500 text-white hover:text-black hover:bg-white hover:border-black transition-all ease-in-out"
              onClick={() => handleCloseDialog(registerRef)}
            >
              <svg
                fill="currentColor"
                height="16"
                icon-name="close-outline"
                viewBox="0 0 20 20"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m18.442 2.442-.884-.884L10 9.116 2.442 1.558l-.884.884L9.116 10l-7.558 7.558.884.884L10 10.884l7.558 7.558.884-.884L10.884 10l7.558-7.558Z"></path>
              </svg>
            </button>
          </div>

          <label htmlFor="">Username</label>
          <input name="username" className="border rounded" type="text"></input>
          <label htmlFor="">Password</label>

          <input
            name="password"
            className="border rounded"
            type="password"
          ></input>

          <label htmlFor="">Email</label>
          <input name="email" className="border" type="email"></input>

          <label htmlFor="">First Name</label>
          <input name="firstName" className="border" type="text"></input>

          <label htmlFor="">Last Name</label>
          <input name="lastName" className="border" type="text"></input>

          <label>Gender</label>

          <select name="gender" className="border">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Others</option>
          </select>

          <label htmlFor="">Birthday</label>
          <input name="birthDate" className="border" type="date"></input>

          <hr className="mt-5"></hr>
          <button
            type="submit"
            className="border rounded px-3 py-2 bg-blue-500 text-white hover:text-blue-500 hover:bg-white transition-all ease-in-out"
          >
            Register
          </button>
        </form>
      </dialog>
    </>
  );
};

export default Register;
