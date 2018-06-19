import React from 'react'
import Router from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Signin from './signin'
import { NextAuth } from 'next-auth/client'
import Cookies from 'universal-cookie'
import Package from '../package'
import Styles from '../css/index.scss'

export default class extends React.Component {

  static propTypes() {
    return {
      session: React.PropTypes.object.isRequired,
      providers: React.PropTypes.object.isRequired,
      children: React.PropTypes.object.isRequired,
      fluid: React.PropTypes.boolean,
      navmenu: React.PropTypes.boolean,
      signinBtn: React.PropTypes.boolean
    }
  }
  
  constructor(props) {
    super(props)
    this.state = {
      navOpen: false,
      modal: false,
      providers: null
    }
    this.togglediv = this.togglediv.bind(this)
  }
  
  async togglediv(e) {
    if (e) e.preventDefault()

    // Save current URL so user is redirected back here after signing in
    if (this.state.modal !== true) {
      const cookies = new Cookies()
      cookies.set('redirect_url', window.location.pathname, { path: '/' })
    }

    this.setState({
      providers: this.state.providers || await NextAuth.providers(),
      modal: !this.state.modal
    })
  }
  
  render() {
    return (
      <React.Fragment>
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <title>{this.props.title || 'Next.js Starter Project'}</title>
          <style dangerouslySetInnerHTML={{__html: Styles}}/>
          <script src="https://cdn.polyfill.io/v2/polyfill.min.js"/>
        </Head>
        <div light className="navbar navbar-expand-md pt-3 pb-3">
          <Link prefetch href="/">
            <div href="/">
              <span className="icon ion-md-home mr-1"></span> {Package.name}
            </div>
          </Link>
          <input className="nojs-navbar-check" id="nojs-navbar-check" type="checkbox" aria-label="Menu"/>
          <label tabIndex="1" htmlFor="nojs-navbar-check" className="nojs-navbar-label mt-2" />
          <div className="nojs-navbar">
            <div navbar>
            </div>
            <UserMenu session={this.props.session} togglediv={this.togglediv} signinBtn={this.props.signinBtn}/>
          </div>
        </div>
        <MainBody navmenu={this.props.navmenu} fluid={this.props.fluid} container={this.props.container}>
          {this.props.children}
        </MainBody>
        <Signindiv modal={this.state.modal} togglediv={this.togglediv} session={this.props.session} providers={this.state.providers}/>
      </React.Fragment>
    )
  }
}

export class MainBody extends React.Component {
  render() {
    if (this.props.container === false) {
      return (
        <React.Fragment>
          {this.props.children}
        </React.Fragment>
      )
    } else if (this.props.navmenu === false) {
      return (
        <div fluid={this.props.fluid} style={{marginTop: '1em'}}>
          {this.props.children}
        </div>
      )
    } else {
      return (
        <div>
          <div>
            <div xs="12" md="9" lg="10">
              {this.props.children}
            </div>
            <div xs="12" md="3" lg="2" style={{paddingTop: '1em'}}>
              <h5 className="text-muted text-uppercase">Examples</h5>
              <div>
                <div>
                  <Link prefetch href="/examples/authentication"><a href="/examples/authentication" className="d-block">Auth</a></Link>
                </div>
                <div>
                    <Link prefetch href="/examples/async"><a href="/examples/async" className="d-block">Async</a></Link>
                </div>
                <div>
                  <Link prefetch href="/examples/layout"><a href="/examples/layout" className="d-block">Layout</a></Link>
                </div>
                <div>
                  <Link prefetch href="/examples/routing"><a href="/examples/routing" className="d-block">Routing</a></Link>
                </div>
                <div>
                    <Link prefetch href="/examples/styling"><a href="/examples/styling" className="d-block">Styling</a></Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}

export class UserMenu extends React.Component {
  constructor(props) {
    super(props)
    this.handleSignoutSubmit = this.handleSignoutSubmit.bind(this)
  }

   async handleSignoutSubmit(event) {
     event.preventDefault()
     
     // Save current URL so user is redirected back here after signing out
     const cookies = new Cookies()
     cookies.set('redirect_url', window.location.pathname, { path: '/' })

     await NextAuth.signout()
     Router.push('/')
   }
   
  render() {
    if (this.props.session && this.props.session.user) {
      // If signed in display user dropdown menu
      const session = this.props.session
      return (
        <div className="ml-auto" navbar>
          {/*<!-- Uses .nojs-dropdown CSS to for a dropdown that works without client side JavaScript ->*/}
          <div tabIndex="2" className="dropdown nojs-dropdown">
            <div className="nav-item">
              <span className="dropdown-toggle nav-link d-none d-md-block">
                <span className="icon ion-md-contact" style={{fontSize: '2em', position: 'absolute', top: -5, left: -25}}></span>
              </span>
              <span className="dropdown-toggle nav-link d-block d-md-none">
                <span className="icon ion-md-contact mr-2"></span>
                {session.user.name || session.user.email}
              </span>
            </div>
            <div className="dropdown-menu">
              <Link prefetch href="/account">
                <a href="/account" className="dropdown-item"><span className="icon ion-md-person mr-1"></span> Your Account</a>
              </Link>
              <AdminMenuItem {...this.props}/>
              <div className="dropdown-divider d-none d-md-block"/>
              <div className="dropdown-item p-0">
                <form id="signout" method="post" action="/auth/signout" onSubmit={this.handleSignoutSubmit}>
                  <input name="_csrf" type="hidden" value={this.props.session.csrfToken}/>
                  <div type="submit" block className="pl-4 rounded-0 text-left dropdown-item"><span className="icon ion-md-log-out mr-1"></span> Sign out</div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )
     } if (this.props.signinBtn === false) {
       // If not signed in, don't display sign in button if disabled
      return null
    } else {
      // If not signed in, display sign in button
      return (
        <div className="ml-auto" navbar>
          <div>
            {/**
              * @TODO Add support for passing current URL path as redirect URL
              * so that users without JavaScript are also redirected to the page
              * they were on before they signed in.
              **/}
            <a href="/auth?redirect=/" className="btn btn-outline-primary" onClick={this.props.togglediv}><span className="icon ion-md-log-in mr-1"></span> Sign up / Sign in</a>
          </div>
        </div>
      )
    }
  }
}

export class AdminMenuItem extends React.Component {
  render() {
    if (this.props.session.user && this.props.session.user.admin === true) {
      return (
        <React.Fragment>
          <Link prefetch href="/admin">
            <a href="/admin" className="dropdown-item"><span className="icon ion-md-settings mr-1"></span> Admin</a>
          </Link>
        </React.Fragment>
      )
    } else {
      return(<div/>)
    }
  }
}

export class Signindiv extends React.Component {
  render() {
    if (this.props.providers === null) return null
    
    return (
      <div isOpen={this.props.modal} toggle={this.props.togglediv} style={{maxWidth: 700}}>
        <div>Sign up / Sign in</div>
        <div style={{padding: '1em 2em'}}>
          <Signin session={this.props.session} providers={this.props.providers}/>
        </div>
      </div>
    )
  }
}