## Simple and Lightweight React Router for Portfolio Projects

### Implementation Steps

1. **Copy the Router Folder**  
   Copy the router folder to your project.

2. **Define Your Routes**  
   The syntax is pretty straightforward and very similar to React Router. Define some routes and the associated components (elements) within the RouterProvider.
   Finally, integrate the fully configured RouterProvider into your main.tsx file to enable seamless navigation throughout your application.

   ```jsx
   <RouterProvider base={"http://localhost:5173"}>
     <Route path={"/"} element={<App />} />
     <Route path={"/page1"} element={<Page1 />} />
     <Route path={"/page2"} element={<Page2 />} />
     <Route path={"/item/:id"} element={<Item />} />
     <Route path={"*"} element={<App />} />
   </RouterProvider>
   ```

3. **Use the `<Link>` Component**
   Use the `<Link>` component instead of the usual anchor `<a>`.

   ```jsx
   <Link href={"/page1/"}>Page 1</Link>
   ```

4. **Access Router Functions**
   Use the `useRouter` hook to access the `navigate` and `getParams` functions.

5. **Programmatic Navigation**

   Access programmatic navigation using the `navigate` function from the `useRouter` hook :

   ```jsx
   import { useRouter } from "./path-to-router-hook";

   function Page2() {
     const { navigate } = useRouter();

     return (
       <div>
         This is Page 2!
         <div onClick={() => navigate("/")}>Home</div>
       </div>
     );
   }
   ```

6. **Access Route Parameters**

   Retrieve dynamic route parameters using the `getParams` function from the `useRouter` hook :

   ```jsx
   import { useRouter } from "./path-to-router-hook";

   function Item() {
     const { getParams } = useRouter();

     // retrieves the /:id segment from such a route : <Route path={"/item/:id"} element={<Item />} />
     return <div>This is Item {getParams().id}</div>;
   }
   ```

7. **Protected Routes**

   To protect any route you have to follow two simple steps :

   - Pass a callback allowing the router to check if the user is authenticated :

     ```jsx
     <RouterProvider base={'http://localhost:5173'} checkAuthCallback={() => isAuthenticated()}>
     ```

   - Mark the target route with the `protect` prop and define a `fallbackElement` :
     ```jsx
     <Route
       path={"/test1"}
       element={<ProtectedPage />}
       protect
       fallbackElement={<Login />}
     />
     ```

### Conclusion

This lightweight React Router alternative offers a simple solution for managing navigation in your portfolio projects.
