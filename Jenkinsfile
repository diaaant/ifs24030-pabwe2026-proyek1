// Pipeline CI/CD BengkelKu Frontend: test, build, lalu deploy dengan Docker Compose.
// Prasyarat Jenkins: plugin Docker Pipeline, serta docker dan docker compose pada agent.
pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '10'))
  }

  parameters {
    booleanParam(name: 'DEPLOY', defaultValue: true, description: 'Jalankan tahap deploy setelah pengujian lulus')
    string(name: 'VITE_API_BASEURL', defaultValue: 'http://localhost:8000/api', description: 'URL API backend')
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Test dan build') {
      agent { docker { image 'node:22-bookworm'; reuseNode true } }
      environment {
        HOME = "${WORKSPACE}"
        VITE_API_BASEURL = "${params.VITE_API_BASEURL}"
      }
      steps {
        sh 'npm ci'
        sh 'npm run test:coverage'
        sh 'npx nuxt generate'
      }
    }

    stage('Deploy') {
      when { expression { params.DEPLOY } }
      environment { VITE_API_BASEURL = "${params.VITE_API_BASEURL}" }
      steps {
        sh 'docker compose up -d --build'
        sh 'sleep 5 && curl -fsS http://localhost:3000/'
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'coverage/**', allowEmptyArchive: true
    }
    success { echo 'Pipeline frontend berhasil: pengujian lulus dan aplikasi ter-deploy.' }
    failure { echo 'Pipeline frontend gagal: periksa log tahap yang gagal.' }
  }
}
