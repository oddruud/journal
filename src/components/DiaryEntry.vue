<template>
    <h2 class="day-of-week">{{ dayOfWeek }}</h2>
    <router-link :to="{ path: '/entry/' + id }" class="entry-link">
      <div :class="['transcription', 'fade-in', 'slide-in']"
           :style="{ backgroundImage: `url(${imageSrc})`}">
     
        <div class="entry">
          <div class="entry-content">
            <div class="date-time">{{ formattedDateTime }}</div>
            <div class="title">{{ title }}</div>
            <div class="transcription-text">{{ displayedTranscription }}</div>
            <div class="keywords"><span>Key words:</span>{{ keyWords }}</div>
          </div>
        </div>
      </div>
    </router-link>
  </template>
  
  <script>
  export default {
    props: {
      currentDateTime: String,
      title: String,
      displayedTranscription: String,
      imageSrc: String,
      keyWords: String,
      isPositive: Boolean,
      dayOfWeek: String,
      id: {
        type: String,
        required: true
      }
    },
    computed: {
      backgroundColorClass() {
        return this.isPositive ? 'bg-green' : 'bg-red';
      },
      formattedDateTime() {
        const date = new Date(this.currentDateTime);
        return date.toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      }
    }
  };
  </script>
  
  <style scoped>
  .transcription {
    font-family: 'Brush Script MT', cursive;
    font-size: 24px;
    color: #333;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 15px;
    animation: fadeIn 0.5s forwards;
    margin: 20px 20px;
    background-size: cover; /* Add this line */
    background-position: center; /* Add this line */
    background-repeat: no-repeat; /* Add this line */
    position: relative;
    min-height: 300px;
    transition: background-size 1s ease; /* Add this line */
  }

  .transcription:hover {
    background-size: 110%; /* Add this line to zoom in */
}
  
  .entry {
    display: flex;
    align-items: top;
    padding:10px;
    border-radius: 15px;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.7);
    min-height: 300px;
  }
  
  .entry-image {
    width: 100px;
    height: auto;
    margin-right: 15px;
  }
  
  .entry-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column; /* Ensure children stack vertically */
  }
  
  .date-time {
    font-family: 'Courier New', Courier, monospace;
    font-size: 14px;
    color: #ffffff;
    margin-bottom: 5px;
  }
  
  .title {
    font-family: 'Roboto', sans-serif;
    font-size: 24px;
    font-weight: bold;
    color: #ffffff;
    margin-bottom: 10px;
  }
  
  .transcription-text {
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    color: #ffffff;
  }

  .keywords{
    font-family: 'Courier New', Courier, monospace;
    font-size: 12px;
    color: #ffffff;
    margin-top: auto; /* Pushes the child to the bottom of the parent */
  }
  
  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
  
  @keyframes slideIn {
    from {
      transform: translateY(40px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .slide-in {
    animation: slideIn 0.5s ease forwards;
  }

  .bg-green {
    background-color: rgba(145, 205, 145, 0.8);
  }

  .bg-red {
    background-color: rgba(186, 131, 131, 0.8);
  }

  .day-of-week {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 1rem;
  }

  .entry-link {
    text-decoration: none;
    display: block;
    cursor: pointer;
    color: red;
  }

  .entry-link:hover .transcription {
    background-size: 110%;
  }
  </style>