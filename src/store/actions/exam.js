import { GET, PATCH, POST } from '@utils/api';
import * as types from '../actionTypes';
import { setLoading } from './loading';
import { setSuccessMsg } from './popup';

import { CommonActions, StackActions } from '@react-navigation/native';
import { Alert } from 'react-native';

export const examsList = data => {
  return {
    type: types.SET_EXAM_LIST,
    payload: data,
  };
};

export const examsListRequest = (query, page_size, page) => {
  return async dispatch => {
    try {
      let url;
      const dataValue = {
        page_size: page_size ? `&page_size=${1}` : '',
        query: query ? `&search=${query}` : '',
        page: page ? `&page=${1}` : '',
      }
      url = `api/exams/list/?${dataValue.query}${dataValue.page}${dataValue.page_size}`

      const response = await GET(url);
      const resJson = await response.json();
      // console.log(response, resJson)
      if (response.status === 200) {
        dispatch(examsList(resJson));
      }
      if (response.status === 400) {
      }
    } catch (error) {
      console.log('err', error);
    }
  };
};

export const examsFullList = data => {
  return {
    type: types.SET_EXAM_FULL_LIST,
    payload: data,
  };
};

export const examsFullListRequest = () => {
  return async dispatch => {
    try {
      // console.log("test",);
      const response = await GET('api/exams/list/');
      const resJson = await response.json();
      // console.log(resJson)
      if (response.status === 200) {
        dispatch(examsFullList(resJson.results));
      }
      if (response.status === 400) {
      }
    } catch (error) {
      console.log('err', error);
    }
  };
};

export const examsEnrollRequest = (data, token) => {
  return async dispatch => {
    try {
      // console.log("test enroll", data, token);
      const response = await POST('api/enrollments/create/', data, token);
      // console.log("enroll", response)
      const resJson = await response.json();
      // console.log("enroll", resJson)
      if (response.status === 201) {
        dispatch(examsFullList(resJson.results));
        dispatch(examDetailRequest(data.exams[0].exam));

        try {
          const response = await GET('api/exams/retrieve/' + data.exams[0].exam) + '/';
          // console.log("exam detail request", response)

          const resJson = await response.json();
          // console.log("exam detail request", resJson)

          if (response.status === 200) {
            dispatch(examDetail(resJson));
          }
          if (response.status === 400) {
          }
        } catch (error) {
          console.log('err', error);
        }
      }
      if (response.status === 400) {
      }
    } catch (error) {
      console.log('err', error);
    }
  };
};

export const examDetail = data => {
  return {
    type: types.SET_EXAM_DETAILS,
    payload: data,
  };
};

export const examDetailRequest = (id) => {
  return async dispatch => {
    try {
      dispatch(setLoading(true));
      const response = await GET('api/exams/retrieve/' + id + '/');
      // console.log("exam detail request", response)

      const resJson = await response.json();
      // console.log("exam detail request", resJson)

      if (response.status === 200) {
        dispatch(examDetail(resJson));
      }
      if (response.status === 400) {
      }
    } catch (error) {
      console.log('err', error);
    }
    dispatch(setLoading(false));
  };
};

export const takeExamDetail = data => {
  return {
    type: types.SET_TAKE_EXAM_DETAILS,
    payload: data,
  };
};

export const takeExamDetailRequest = (id, token, checklistInit = () => { }, answers, setAnswers = () => { }, setCurrentQuestion = () => { }) => {
  return async dispatch => {
    try {
      const response = await GET('api/exams/paper/' + id, token);
      // console.log(response)
      const resJson = await response.json();
      // console.log(resJson)
      if (response.status === 200) {
        dispatch(takeExamDetail(resJson));
        checklistInit(resJson.questions);

        try {
          const response2 = await GET('api/enrollments/exam/checkpoint/' + resJson.exam_enroll.id, token);
          // console.log("exam checkpoint", response2)

          const resJson2 = await response2.json();
          // console.log("exam checkpoint", resJson2)

          if (response2.status === 200) {
            // dispatch(examDetail(resJson));

            setAnswers(prevState => {
              let tempState = { ...prevState };
              tempState.question_states = resJson2.question_states;
              return tempState;
            });
            setCurrentQuestion(resJson2.question_states.length)
          }
          if (response2.status === 400) {
          }
        } catch (error) {
          console.log('err', error);
        }
      }
      if (response.status === 400) {
      }
    } catch (error) {
      console.log('err', error);
    }
  };
};

export const submitExam = (enrollId, data, token, navigate = () => { }, examId, navigation) => {
  return async dispatch => {
    try {
      dispatch(setSubmitting('submitting', true));
      // console.log("data", data);
      const response = await PATCH('api/enrollments/exam/submit/' + enrollId.id, data, token);
      // console.log("submit exma", response)
      const resJson = await response.json();
      // console.log("submit exam", resJson)
      if (response.status === 200) {
        if (data.submitted) {
          // dispatch(setSuccessMsg('Test has been submitted'));
        }
        // navigate('ExamDetail', { id: examId });
        // navigation.dispatch(CommonActions.goBack());

        // navigation.dispatch(
        //   StackActions.replace('ExamDetail', { id: examId })
        // );

        dispatch(setSubmitting('submitted', true));

        setTimeout(() => {
          dispatch(setSubmitting('', false));

          navigation.dispatch(
            StackActions.replace('ExamDetail', { id: examId })
          );
        }, 1000);

      }
      if (response.status === 400) {
        dispatch(setSubmitting('', false));
        Alert.alert(
          "Error",
          "An error occured wile submitting the exam, but dont worry your checkpoints have been set.",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ]
        );
      }
    } catch (error) {
      console.log('err', error);
    }

  };
};

export const examResults = data => {
  return {
    type: types.SET_EXAM_RESULT,
    payload: data,
  };
};

export const examResultsRequest = (id, token) => {
  return async dispatch => {
    try {
      // console.log("action", id, token);
      const response = await GET('api/enrollments/exam/result/' + id, token);
      // console.log(response)
      const resJson = await response.json();
      // console.log(resJson)
      if (response.status === 200) {
        dispatch(examResults(resJson));

      }
      if (response.status === 400) {
      }
    } catch (error) {
      console.log('err', error);
    }
  };
};

export const setSubmitting = (data1, data2) => {
  return {
    type: types.SET_SUBMITTING,
    submitting: data1,
    showSubmitting: data2,
  };
};