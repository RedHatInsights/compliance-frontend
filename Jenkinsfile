/*
 * Requires: https://github.com/RedHatInsights/insights-pipeline-lib
 */

@Library("github.com/quarckster/insights-pipeline-lib@iqe") _

node {
    cancelPriorBuilds()
    scmVars = checkout scm

    if (env.BRANCH_NAME == 'master' && scmVars.GIT_COMMIT != scmVars.GIT_PREVIOUS_SUCCESSFUL_COMMIT) {

        stage('Wait until frontend is updated') {
            withCredentials([string(credentialsId: "compliance_app_info_url", variable: "APP_INFO_URL")]) {
                waitForFrontend(scmVars: scmVars, appInfoUrl: env.APP_INFO_URL, timeout: 300)
            }
        }

        runStages()
    }
}

def runStages() {
    openShift.withNode(image: "docker-registry.default.svc:5000/jenkins/jenkins-slave-iqe:latest") {
        // check out source again to get it in this node's workspace
        scmVars = checkout scm

        stage('Install integration tests env') {
            runIqeInstall(pluginName: "iqe-compliance-plugin")
        }

        stage('Run integration tests') {
            withStatusContext.integrationTest {
                sh "iqe tests plugin compliance -v --junitxml=junit.xml"
            }

            junit 'junit.xml'
        }
    }
}
