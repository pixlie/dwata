function Setup() {
  return (
    <>
      <p>
        You have not set the initial settings in <pre>dwata/backend/.env</pre>
      </p>
      <p>
        Please copy <pre>dwata/backend/.env.copy</pre> as a new file{" "}
        <pre>dwata/backend/.env</pre> and set the values as in comments
      </p>
    </>
  );
}

export default Setup;
