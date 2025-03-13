// import logo from '@/app/assets/images/logo.png';

export default function NavBar(props?: {
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
}) {
  // const navButtonClassName =
  //   'my-auto h-8 w-20 border border-solid border-white rounded-2xl hover:bg-[gray]';

  return (
    <div className='w-full'>
      <div
        className='flex justify-between mx-auto text-white'
        style={{
          width: props?.width ?? '65%',
          height: props?.height ?? '3rem',
          minWidth: props?.minWidth,
          minHeight: props?.minHeight
        }}
      >
        {/* <img src={logo.src} alt="Logo" height="100%" fetchPriority="high" loading="eager" decoding="async" /> */}
        <ul className='flex justify-between items-center w-[30%]'>
          {/* <li><a href="/support"><button className={navButtonClassName}>Support</button></a></li> */}
          {/* { currentUser ? <></> : <li>
                        <PopupContainer trigger={
                            <button className={navButtonClassName}>Login</button>
                        } arrow={false} overlay={true} content={
                            <Login />
                        } />
                    </li> } */}
          {/* <li><a href="/signup"><button className={navButtonClassName}>Sign up</button></a></li> */}
        </ul>
      </div>
    </div>
  );
}
