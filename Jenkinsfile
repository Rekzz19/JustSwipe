pipeline{
    agent any

    stages{
        stage('Build'){
            //build docker image - this tells docker to build an image using the dockerfile
            steps {
                echo 'Building Docker image...'
                sh 'docker build -t nextjs-app .'
            }
        }

        stage('Test'){
            steps {
                echo 'Running tests...'
                sh 'docker run --rm -e NODE_ENV=test nextjs-app npm test'
            }
        }

        stage('Deploy'){
            steps{
                echo 'Deploying container...'
                sh 'docker stop nextjs-app || true'
                sh 'docker rm nextjs-app || true'
                sh 'docker run -d -p 3000:3000 --name justswipe nextjs-app'
            }
        }
    }

    post{
        always {
            echo 'Pipeline finished. Cleaning up...'
            sh 'docker system prune -f' //clean up old containers
        }
        success {
            echo 'Deployed successfully!'

        }
        failure {
            echo 'Pipeline failed. Check logs.'
        }
        unstable {
            echo 'Tests passed but something is unstable.'
            
        }

    }
}