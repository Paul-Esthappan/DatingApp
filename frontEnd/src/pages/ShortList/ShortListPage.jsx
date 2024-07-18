import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import axios from "axios";
import { userRequest } from "../../utils/axios/axios";

const ShortListPage = () => {
  const [shortlistedUsers, setShortlistedUsers] = useState([]);
  const [usersWhoShortlisted, setUsersWhoShortlisted] = useState([]);

  useEffect(() => {
    // Fetch shortlisted users
    const fetchShortlistedUsers = async () => {
      try {
        const response = await userRequest.get("/api/interactions/shortlisted");
        setShortlistedUsers(response.data.shortlistedUsers || []);
      } catch (err) {
        console.error("Error fetching shortlisted users:", err.message);
        setShortlistedUsers([]);
      }
    };

    // Fetch users who shortlisted the logged-in user
    const fetchUsersWhoShortlisted = async () => {
      try {
        const response = await userRequest.get(
          "/api/interactions/shortlistedBy"
        );
        setUsersWhoShortlisted(response.data.shortlistedByUsers || []);
        console.log("fetch responce shortlisted by",response);
      } catch (err) {
        console.error("Error fetching users who shortlisted:", err.message);
        setUsersWhoShortlisted([]);
      }
    };

    fetchShortlistedUsers();
    fetchUsersWhoShortlisted();
  }, []);

  return (
    <div>
      <Tabs>
        <TabList>
          <Tab>Shortlisted Users</Tab>
          <Tab>Users Who Shortlisted You</Tab>
        </TabList>

        <TabPanel>
          <h2>Shortlisted Users</h2>
          <ul>
            {shortlistedUsers && shortlistedUsers.length > 0 ? (
              shortlistedUsers.map((user) => (
                <div className="flex">
                  <img src={shortlistedUsers.image} alt="no image" />
                  <li key={user._id}>{user.displayName}</li>
                </div>
              ))
            ) : (
              <li>No users shortlisted</li>
            )}
          </ul>
        </TabPanel>

        <TabPanel>
          <h2>Users Who Shortlisted You</h2>
          <ul>
            {usersWhoShortlisted && usersWhoShortlisted.length > 0 ? (
              usersWhoShortlisted.map((user) => (
                <div className="flex">
                  <img src={usersWhoShortlisted.image} alt="no image" />
                  <li key={user._id}>{user.displayName}</li>
                </div>
              ))
            ) : (
              <li>No users have shortlisted you</li>
            )}
          </ul>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default ShortListPage;
