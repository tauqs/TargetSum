import React from "react";
import PropTypes from 'prop-types';
import {View, Text, StyleSheet } from 'react-native';
import RandomNumber from './RandomNumber';

class Game extends React.Component {
    static propTypes = {
        randomNumberCount: PropTypes.string.isRequired,
    }

   // target = 10 + Math.floor(40*Math.random());

    state = {
      selectedIds: [],
      remainingSeconds: this.props.initialSeconds,
    }

    randomNumbers = Array
    .from({length: this.props.randomNumberCount})
    .map(() => 1 + Math.floor(10*Math.random()));
    
    target = this.randomNumbers
    .slice(0, this.props.randomNumberCount - 2)
    .reduce((acc,curr) => acc + curr, 0);


    componentDidMount() {
        setInterval(() => {
            this.setState((prevState) => {
                return {remainingSeconds: prevState.remainingSeconds - 1};
            });
        }, 1000);
    }

    isNumberSelected = (numberIndex) => {
        return this.state.selectedIds.indexOf(numberIndex) >= 0;
    }

    selectedNumber = (numberIndex) => {
        this.setState((prevState) => {
            return {selectedIds:[...prevState.selectedIds, numberIndex]};
        });
    }

    // gameStatus: PLAYING, WON, LOST
    gameStatus = () => {
        const sumSelected = this.state.selectedIds.reduce((acc, curr) => {
            return acc + this.randomNumbers[curr];
        }, 0);

        if (sumSelected < this.target) {
            return 'PLAYING'
        }
        if (sumSelected === this.target) {
            return 'WON'
        }
        if (sumSelected > this.target) {
            return 'LOST'
        }
    }

    render() {
        const gameStatus = this.gameStatus();
        return (
            <View style={styles.container}>
                <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>{this.target}</Text>
                <View style={styles.randomContainer}>
                    {
                       this.randomNumbers.map((randomNumber, index) => 
                       <RandomNumber key={index} id={index} number={randomNumber} 
                       isDisabled = {this.isNumberSelected(index) || gameStatus != 'PLAYING'}
                       onPress={this.selectedNumber}> </RandomNumber>)
                    }
                </View>
                <Text style={styles.timer}>{gameStatus}</Text>  
                <Text style={styles.timer}>{this.state.remainingSeconds}</Text>    
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ddd',
        flex:1,
        paddingTop: 40,
    },

    target: {
        fontSize: 40,
        backgroundColor: '#aaa',
        marginHorizontal: 50,
        textAlign: 'center'
    },

    randomContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },

    STATUS_PLAYING: {
        backgroundColor: '#bbb',
    },

    STATUS_WON: {
        backgroundColor: 'green',
    },

    STATUS_LOST: {
        backgroundColor: 'red',
    },

    timer: {
        paddingLeft: 40
    }
});


export default Game;