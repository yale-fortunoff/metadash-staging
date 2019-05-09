import React from 'react';
import TagPoolItem from "./TagPoolItem";
import "./style/main.scss"

export default class extends React.Component{

    render(){
        return (
            <div className="TagPool">
                {(this.props.items || []).map((item, i)=>{
                    return (
                    <TagPoolItem 
                    callback={this.props.callback || function(){}} 
                    key={i} 
                    item={item}></TagPoolItem>
                    )
                })}
            </div>
        )
    }
}