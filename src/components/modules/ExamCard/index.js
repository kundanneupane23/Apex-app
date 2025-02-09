import React, { Fragment } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import styles from '@styles/modules/ExamCard'
import NoteIcon from '@assets/images/note.svg'
import Tag from '@components/elements/Tag'


const ExamCard = (props) => {

  const { name, price, duration, id, actionPress, tags } = props;

  return (
    <TouchableOpacity activeOpacity={1} onPress={actionPress} style={styles.cards}>
      <View style={styles.card}>
        <View style={styles.file}>
          <NoteIcon style={styles.icon} />
        </View>
        <View style={styles.tagContainer}>
          {tags.length > 0 && tags.map((t, index) => {
            return (
              <Fragment key={index}>
                <Tag title={t.title} />
              </Fragment>
            )
          })}
        </View>
      </View>

      <View >
        <Text style={styles.text}>{name}</Text>

        <Text style={styles.amount}>
          Rs. {price}
          {' \u2022 '}
          {duration}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default ExamCard
