import React, { Component } from 'react'
import StatusSeekerContract from '../build/contracts/StatusSeeker.json'
import Config from '../truffle.js'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      keyWord: ''
    }

    this.getKeyWord = this.getKeyWord.bind(this);
  }

  componentDidMount() {     
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  getKeyWord(e) {
    e.preventDefault();

    // So we can update state later.
    var self = this

    // Declare the contract abstractions
    const contract = require('truffle-contract')
    const statusSeeker = contract(StatusSeekerContract)
    statusSeeker.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on StatusSeeker.
    var statusSeekerInstance

    // Get accounts.
    this.state.web3.eth.getAccounts(function(error, accounts) {
      console.log(accounts)

      statusSeekerInstance = statusSeeker.at("0x9cfd83d56a7937cf7c5afe2281e4738472c4ab61")
        // Generate random number between 0 and 11. Once we have implemented QR code support
        // this id will be generated when the users scans the QR and the corresponding word
        // will be returned without giving away it's position in the array.
        var id = Math.floor((Math.random() * 11));

        statusSeekerInstance.keyWord.call(id, {from: accounts[0]}).then(function(result) {
        // Update state with the result.
        return self.setState({ keyWord: result.toString() })
      })
    })
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Status Community</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Smart Contract Seekers</h1>
              <p>The below will show a stored key word that is part of a 12 word phrase that can be used to reconstruct a private key in order to earn a reward.</p>
              <p>This is a simple proof of concept, obviously, we will need to implement the ability to scan a QR code from a DApp that will generate the right call
                and only then diplay the result to the seeker.</p>
              <div className="button-kw-container">
                <button className="button-kw" onClick={this.getKeyWord}>Get Key Word</button>
              </div>
              <p>Your lucky one of twelve key words is (drumroll):</p>
              <p className="center-text"><strong>{this.state.keyWord}</strong></p>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
