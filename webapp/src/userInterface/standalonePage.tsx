interface IPropTypes {
  title: string;
  children: JSX.Element;
}

function StandalonePage({ title, children }: IPropTypes): JSX.Element {
  return (
    <div className="max-w-lg mx-auto rounded-t-xl bg-gray-100 my-8">
      <div className="bg-blue-200 rounded-t-xl border-b border-blue-300">
        <h1 className="text-center">{title}</h1>
      </div>

      <div className="p-8">{children}</div>
    </div>
  );
}

export default StandalonePage;
