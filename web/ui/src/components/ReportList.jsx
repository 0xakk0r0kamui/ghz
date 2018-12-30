import React, { Component } from 'react'
import { Table, Heading, IconButton, Pane, Icon, Tooltip } from 'evergreen-ui'
import { Link as RouterLink } from 'react-router-dom'

import {
  Order,
  getIconForOrder,
  getIconForStatus,
  getColorForStatus,
  formatNano,
  formatFloat
} from '../lib/common'

export default class ReportList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      projectId: props.projectId || 0,
      ordering: Order.DESC,
      sort: 'date',
      page: 0
    }
  }

  componentDidMount () {
    this.props.reportStore.fetchReports(
      this.state.ordering, this.state.sort, this.state.page, this.state.projectId)
  }

  componentDidUpdate (prevProps) {
    if ((prevProps.projectId === this.props.projectId) &&
      !this.props.reportStore.state.isFetching) {
      const currentList = this.props.reportStore.state.reports
      const prevList = prevProps.reportStore.state.reports

      if (currentList.length === 0 && prevList.length > 0) {
        this.setState({ page: 0 })
        this.props.reportStore.fetchReports(
          this.state.ordering, this.state.sort, this.state.page, this.props.projectId)
      }
    }
  }

  sort () {
    const order = this.state.ordering === Order.ASC ? Order.DESC : Order.ASC
    this.props.reportStore.fetchReports(
      order, this.state.sort, this.state.page, this.state.projectId)
    this.setState({ ordering: order })
  }

  fetchPage (page) {
    if (page < 0) {
      page = 0
    }

    this.props.reportStore.fetchReports(
      this.state.ordering, this.state.sort, page, this.state.projectId)

    this.setState({ page })
  }

  render () {
    const { state: { reports, total } } = this.props.reportStore

    const totalPerPage = 20

    return (
      <Pane>
        <Pane display='flex' alignItems='center' marginTop={6}>
          <Heading size={500}>REPORTS</Heading>
        </Pane>

        <Table marginY={30}>
          <Table.Head>
            <Table.TextHeaderCell minWidth={210} textProps={{ size: 400 }}>
              <Pane display='flex'>
                Date
                <IconButton
                  marginLeft={10}
                  icon={getIconForOrder(this.state.ordering)}
                  appearance='minimal'
                  height={20}
                  onClick={() => this.sort()}
                />
              </Pane>
            </Table.TextHeaderCell>
            <Table.TextHeaderCell textProps={{ size: 400 }} maxWidth={100}>
              Count
            </Table.TextHeaderCell>
            <Table.TextHeaderCell textProps={{ size: 400 }}>
              Total
            </Table.TextHeaderCell>
            <Table.TextHeaderCell textProps={{ size: 400 }}>
              Average
            </Table.TextHeaderCell>
            <Table.TextHeaderCell textProps={{ size: 400 }}>
              Slowest
            </Table.TextHeaderCell>
            <Table.TextHeaderCell textProps={{ size: 400 }}>
              Fastest
            </Table.TextHeaderCell>
            <Table.TextHeaderCell textProps={{ size: 400 }}>
              RPS
            </Table.TextHeaderCell>
            <Table.TextHeaderCell maxWidth={80} textProps={{ size: 400 }}>
              Status
            </Table.TextHeaderCell>
          </Table.Head>
          <Table.Body>
            {reports.map(p => (
              <Table.Row key={p.id}>
                <Table.TextCell minWidth={210} textProps={{ size: 400 }}>
                  {p.name
                    ? (
                      <Tooltip content={p.name}>
                        <RouterLink to={`/reports/${p.id}`}>
                          {p.date}
                        </RouterLink>
                      </Tooltip>
                    )
                    : (
                      <RouterLink to={`/reports/${p.id}`}>
                        {p.date}
                      </RouterLink>
                    )}
                </Table.TextCell>
                <Table.TextCell isNumber maxWidth={100}>
                  {p.count}
                </Table.TextCell>
                <Table.TextCell isNumber>
                  {formatNano(p.total)} ms
                </Table.TextCell>
                <Table.TextCell isNumber>
                  {formatNano(p.average)} ms
                </Table.TextCell>
                <Table.TextCell isNumber>
                  {formatNano(p.slowest)} ms
                </Table.TextCell>
                <Table.TextCell isNumber>
                  {formatNano(p.fastest)} ms
                </Table.TextCell>
                <Table.TextCell isNumber>
                  {formatFloat(p.rps)}
                </Table.TextCell>
                <Table.TextCell
                  display='flex' textAlign='center' maxWidth={80}>
                  <Icon
                    icon={getIconForStatus(p.status)}
                    color={getColorForStatus(p.status)} />
                </Table.TextCell>
              </Table.Row>
            ))}
          </Table.Body>
          <Pane justifyContent='right' marginTop={10} display='flex'>
            <IconButton
              disabled={total < totalPerPage || this.state.page === 0}
              icon='chevron-left'
              onClick={() => this.fetchPage(this.state.page - 1)}
            />
            <IconButton
              disabled={total < totalPerPage || reports.length < totalPerPage}
              marginLeft={10}
              icon='chevron-right'
              onClick={() => this.fetchPage(this.state.page + 1)}
            />
          </Pane>
        </Table>
      </Pane>
    )
  }
}
