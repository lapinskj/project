import React, { Component } from "react";
import axios from "axios";
import EditCategoryModal from "./EditCategoryModal";

class Categories extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            categoriesList: [],
            activeItem: {},
        };
    }
    componentDidMount() {
        this.refreshList();
    }

    refreshList = () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };
        axios
            .get("http://localhost:8000/categories/", config)
            .then(res => this.setState({ categoriesList: res.data }))
            .catch(err => console.log(err));
    };

    toggle = () => {
        this.setState({ modal: !this.state.modal });
    };

    handleSubmit = item => {
        this.toggle();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };
        console.log(item);
        if (item.id) {
            axios
                .put(`http://localhost:8000/categories/${item.id}/`, item, config)
                .then(res => this.refreshList());
            return;
        }
        axios
            .post("http://localhost:8000/categories/", item, config)
            .then(res => this.refreshList());
    };
    handleDelete = item => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };
        axios
            .delete(`http://localhost:8000/categories/${item.id}`, config)
            .then(res => this.refreshList());
    };

    createItem = () => {
        const item = {};
        this.setState({ activeItem: item, modal: !this.state.modal });
    };

    editItem = item => {
        this.setState({ activeItem: item, modal: !this.state.modal });
    };

    renderCategories = () => {
        const categoriesList = this.state.categoriesList;
        return categoriesList.map(item => (
            <li key={item.id}>
                <span>
                    {item.code} {item.name}
                </span>
                <span>
                    <button onClick={() => this.editItem(item)} className="btn btn-info ml-2"> Edit </button>
                    <button onClick={() => this.handleDelete(item)} className="btn btn-danger ml-2"> Delete </button>
                </span>
            </li>
        ));
    };

    render() {
        return (
            <main className="content">
                <div>
                    <button onClick={this.createItem} className="btn btn-secondary">
                        Add category
                    </button>
                    <ul>
                        {this.renderCategories()}
                    </ul>
                    {this.state.modal ? (
                        <EditCategoryModal
                            activeItem={this.state.activeItem}
                            toggle={this.toggle}
                            onSave={this.handleSubmit}
                        />
                    ) : null}
                </div>
            </main>
        );
    }

}

export default Categories;
