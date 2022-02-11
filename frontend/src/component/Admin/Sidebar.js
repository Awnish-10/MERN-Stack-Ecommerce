import React from "react";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AddIcon from "@mui/icons-material/Add";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PeopleIcon from "@mui/icons-material/People";
import RateReviewIcon from "@mui/icons-material/RateReview";
import logo from "../../images/logo.png";
import "./sidebar.css";

const Sidebar = () => {
    const currPath = window.location.pathname;
    return (
        <>
            <div className="sidebar">
                <Link to="/">
                    <img src={logo} alt="Ecommerce" />
                </Link>
                <Link to="/admin/dashboard">
                    <p>
                        <DashboardIcon /> Dashboard
                    </p>
                </Link>
                <Link to={currPath}>
                    <TreeView
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpandIcon={<ImportExportIcon />}
                    >
                        <TreeItem nodeId="1" label="Products">
                            <Link to="/admin/products">
                                <TreeItem
                                    nodeId="2"
                                    label="All"
                                    icon={<PostAddIcon />}
                                />
                            </Link>

                            <Link to="/admin/new-product">
                                <TreeItem
                                    nodeId="3"
                                    label="Create"
                                    icon={<AddIcon />}
                                />
                            </Link>
                        </TreeItem>
                    </TreeView>
                </Link>

                <Link to="/admin/orders">
                    <p>
                        <ListAltIcon />
                        Orders
                    </p>
                </Link>
                <Link to="/admin/users">
                    <p>
                        <PeopleIcon /> Users
                    </p>
                </Link>
                <Link to="/admin/reviews">
                    <p>
                        <RateReviewIcon />
                        Reviews
                    </p>
                </Link>
            </div>
        </>
    );
};

export default Sidebar;
