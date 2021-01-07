import {React, Component} from "react";
import {CHeaderNavItem, CHeaderNavLink} from "@coreui/react";
import Badge from "@material-ui/core/Badge";
import InboxIcon from "@material-ui/icons/Inbox";
import returnConfig from "../pharmacy/returnConfig";
import axios from "axios";


class MessagesCounter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            unreadMessagesCount: null
        };
    }

    getUnreadMessagesCount () {
        const config = returnConfig();
        axios
            .get("http://localhost:8000/newOrderMessages/countUnread/", config)
            .then(res => {
                this.setState({ unreadMessagesCount: res.data['count'] })
            }).catch(err => console.log(err));
    }

    componentDidMount() {
        this.getUnreadMessagesCount();
        this.interval = setInterval(() => {
            this.getUnreadMessagesCount();
        }, 6000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }


    render(){
        return(
            <CHeaderNavItem  className="px-3">
                <CHeaderNavLink to="/newOrderMessages">
                    <Badge badgeContent={this.state.unreadMessagesCount} color="primary">
                        <InboxIcon />
                    </Badge>
                </CHeaderNavLink>
            </CHeaderNavItem>
        )
    }
}



export default MessagesCounter;