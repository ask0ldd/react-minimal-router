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

   Access programmatic navigation using the `navigate` function from `useRouter` hook :

   ```jsx
   import { useRouter } from './path-to-router-folder';

   function ProjectCard({ id }) {
       const { navigate } = useRouter();

       const handleClick = () => {
       navigate(`/project/${id}`);
       };

       return View Project;
   }
   ```

6. **Access Route Parameters**

   Retrieve dynamic route parameters using the `getParams` function from `useRouter` hook :

   ```jsx
   import { useRouter } from './path-to-router-folder';

   function ProjectDetails() {
   const { getParams } = useRouter();
   const { id } = getParams();

   return Project Details for Project {id};
   }
   ```

7. **Protected Routes**

   To protect any route you have to follow two simple steps :

   - Pass a callback allowing the router to check if the user is authenticated :

     ```jsx
     <RouterProvider base={'http://localhost:5173'} checkAuthCallback={() => false}>
     ```

   - Mark the target route with the `protect` prop and defined a `fallbackElement` :
     ```jsx
     <Route
       path={"/test1"}
       element={<Page1 />}
       protect
       fallbackElement={<App />}
     />
     ```

### Conclusion

This lightweight React Router alternative offers a simple solution for managing navigation in your portfolio projects.
