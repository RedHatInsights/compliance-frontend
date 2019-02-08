/*
 * Requires: https://github.com/RedHatInsights/insights-pipeline-lib
 */

@Library("github.com/quarckster/insights-pipeline-lib@iqe") _

node {
    cancelPriorBuilds()
    scmVars = checkout scm

    if (env.BRANCH_NAME == 'master' && scmVars.GIT_COMMIT != scmVars.GIT_PREVIOUS_SUCCESSFUL_COMMIT) {
        runStages()
    }
}

def runStages() {
    openShift.withUINode() {
        // check out source again to get it in this node's workspace

        stage('Install integration tests env') {
            sh 'pip install iqe-integration-tests'
            sh 'iqe plugin install iqe-compliance-plugin'
        }

        stage('Run integration tests') {
            withStatusContext.integrationTest {
                sh "ENV_FOR_DYNACONF=ci iqe tests plugin compliance -v -s -k test_get_all_policies --junitxml=junit.xml"
            }

            junit 'junit.xml'
        }
    }
}
