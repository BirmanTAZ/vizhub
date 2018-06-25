import React from 'react'
import Page from '../../components/page'
import Layout from '../../components/layout'
import { BodyAuthenticated, BodyNotAuthenticated } from './body'

export default class extends Page {
  constructor() {
    super()

    this.createVisualizationFromScratch = (
      this.createVisualizationFromScratch.bind(this)
    )
  }

  createVisualizationFromScratch() {
    const { gateway, user } = this.props;

    gateway
      .createVisualization({ owner: user.id })
      .then(({id}) => {
        console.log("Created visualization with id " + id);
        console.log("TODO redirect to editor");
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <Layout
        title='Datavis.tech'
        lang={this.props.lang}
        user={this.props.user}
      >
        {
          this.props.user
            ? (
              <BodyAuthenticated
                onFromScratchClick={this.createVisualizationFromScratch}
              />
            )
            : <BodyNotAuthenticated />
        }
      </Layout>
    )
  }
}