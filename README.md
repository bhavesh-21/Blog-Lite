### Features

1.	Login/Sign Up page: backend support with login framework, flask-login, flask-wtf and sessions.
2.	APIs for interaction with users and blogs: CRUD for user and Post.
3.	Searching for a user, feed and My Blogs.
4.	Feed: System will automatically show the blogs from the user follow in a particular sequence based on the timestamp.
5.	User profile view with basic stats.
6.	Search and Follow / Unfollow Others.
7.	Blog management: Create, Edit and Remove Blog.
8.	Validation: All form inputs fields - text, numbers, dates etc. with suitable messages. Backend validation before storing / selecting from database.
9.	Engagement on Blogs/Posts: Ability to like or add comments on a blog.
10.	Styling and Aesthetics as per latest trend.
11.	Fully Responsive on any device.
12.	CKEditor: Advanced editor to write and style post content easily.
13.	Pagination: A single window contains only 9 posts and can change to next page by Next Page Button.
14.	Profile Picture Upload: Upload profile picture.
15.	Post video upload: Upload Post Picture.
16.	View my followers and following user details: Get details of followers and following.
17.	Delete account with confirmation: Dialog box for account deletion.
18.	Posts as Cards.


# Blog Lite
<img src="./web_pic/blog-black.png" alt="Image" style="width: 300px;">

# Local Run
1. run make_env.sh to me virtual enviornment.
2. run Run.sh to run app.py after activating virtual enviornment.
3. Goto http://localhost:8000 to view app.

# ER Diagram
![Image](https://raw.githubusercontent.com/bhavesh-21/Images/2992094a1d9a887e37d66461adda5c32e80ba715/MAD-1-BlogLite-ER-diagram.png)

# Tables
<table>
<thead>
        <th>Column Name</th>
        <th>Column Type</th>
        <th>Constraints</th>
      </thead>
      <tbody>
      <tr>
        <td>id</td>
        <td>Integer</td>
        <td>Primary Key,Auto Increment</td>
      </tr>
      </tbody>
      <tbody>
      <tr>
        <td>username</td>
        <td>String</td>
        <td>Unique,Not Null</td>
      </tr>
      </tbody>
      <tbody>
      <tr>
        <td>name</td>
        <td>String</td>
        <td>Not Null</td>
      </tr>
      </tbody>
      <tbody>
      <tr>
        <td>email</td>
        <td>String</td>
        <td>Unique,Not Null</td>
      </tr>
      </tbody>
      <tbody>
      <tr>
        <td>about_author</td>
        <td>Text</td>
        <td>default='None'</td>
      </tr>
      </tbody>
      <tbody>
      <tr>
        <td>last_login</td>
        <td>DateTime</td>
        <td>default=datetime.utcnow</td>
      </tr>
      </tbody>
      <tbody>
      <tr>
        <td>profile_pic</td>
        <td>String</td>
        <td>default='default_profile_pic.png'</td>
      </tr>
      </tbody>
      <tbody>
      <tr>
        <td>password_hash</td>
        <td>String</td>
        <td></td>
      </tr>
      </tbody>
    </table>  
      <h2>Posts Table Schema</h2>  <table>
      <thead>
        <th>Column Name</th>
        <th>Column Type</th>
        <th>Constraints</th>
      </thead>
      <tbody>
      <tr>
        <td>id</td>
        <td>Integer</td>
        <td>Primary Key,Auto Increment</td>
      </tr>
      </tbody>
      <tbody>
      <tr>
        <td>content</td>
        <td>Text</td>
        <td></td>
      </tr>
      </tbody>
      <tbody>
      <tr>
        <td>timestamp</td>
        <td>DateTime</td>
        <td>default=datetime.utcnow </td>
      </tr>
      </tbody>
      <tbody>
      <tr>
        <td>slug</td>
        <td>String</td>
        <td></td>
      </tr>
      </tbody>
      <tbody>
      <tr>
        <td>thumbnail</td>
        <td>String</td>
        <td>default='default_thumbnail.jpg'</td>
      </tr>
      </tbody>
      <tbody>
      <tr>
        <td>poster_id</td>
        <td>Integer</td>
        <td>ForeignKey('users.id'),Not Null</td>
      </tr>
      </tbody>
    </table>
    <h2>Comment Table Schema</h2>  <table>
      <thead>
        <th>Column Name</th>
        <th>Column Type</th>
        <th>Constraints</th>
      </thead>
      <tbody>
      <tr>
        <td>id</td>
        <td>Integer</td>
        <td>Primary Key,Auto Increment</td>
      </tr>
      </tbody>
      <tbody>
      <tr>
        <td>text</td>
        <td>String</td>
        <td>Not Null</td>
      </tr>
      </tbody>
      <tbody>
      <tr>
        <td>date_created</td>
        <td>DateTime</td>
        <td>default=datetime.utcnow</td>
      </tr>
      </tbody>
      <tbody>
      <tr>
        <td>author</td>
        <td>Integer</td>
        <td>ForeignKey('users.id'), Not Null</td>
      </tr>
      </tbody>
      <tbody>
      <tr>
        <td>post_id</td>
        <td>Integer</td>
        <td>ForeignKey('posts.id'), Not Null</td>
      </tr>
      </tbody>
    </table>
    <h2>Like Table Schema</h2>  <table>
      <thead>
        <th>Column Name</th>
        <th>Column Type</th>
        <th>Constraints</th>
      </thead>
      <tbody>
      <tr>
        <td>id</td>
        <td>Integer</td>
        <td>Primary Key,Auto Increment</td>
      </tr>
      </tbody>
      <tbody>
      <tr>
        <td>date_created</td>
        <td>DateTime</td>
        <td>default=datetime.utcnow</td>
      </tr>
      </tbody>
      <tbody>
      <tr>
        <td>author</td>
        <td>Integer</td>
        <td>ForeignKey('users.id'), Not Null</td>
      </tr>
      </tbody>
      <tbody>
      <tr>
        <td>post_id</td>
        <td>Integer</td>
        <td>ForeignKey('posts.id'), Not Null</td>
      </tr>
      </tbody>
    </table>
    <h2>Followers Table Schema</h2>  <table>
      <thead>
        <th>Column Name</th>
        <th>Column Type</th>
        <th>Constraints</th>
      </thead>
      <tbody>
      <tr>
        <td>follower_id</td>
        <td>Integer</td>
        <td>ForeignKey('users.id')</td>
      </tr>
      </tbody>
      <tbody>
      <tr>
        <td>followed_id</td>
        <td>Integer</td>
        <td>ForeignKey('users.id')</td>
      </tr>
      </tbody>
      <tbody>
      <tr>
        <td>timestamp</td>
        <td>DateTime</td>
        <td>default=datetime.utcnow</td>
      </tr>
      </tbody>
    </table> 
    <h2> Error Codes </h2>  <table>
      <thead>
        <th>Resource</th>
        <th>Error Code</th>
        <th>Message</th>
      </thead>
      <tbody>
      <tr>
        <td>User</td>
        <td>USR001</td>
        <td>username is required</td>
      </tr>
      <tr>
        <td>User</td>
        <td>USR002</td>
        <td>email is required</td>
      </tr>
      <tr>
        <td>User</td>
        <td>USR003</td>
        <td>Invalid email</td>
      </tr>
      <tr>
        <td>User</td>
        <td>USR004</td>
        <td>Username Already Occupied.</td>
      </tr>
      <tr>
        <td>User</td>
        <td>USR005</td>
        <td>Please use a different email address.</td>
      </tr>
      </tbody>
    </table>
