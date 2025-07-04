#!/usr/bin/env node

import { Command } from 'commander'
import chalk from 'chalk'

// Import modules directly for better compatibility
import { PerformanceAnalyzer, PerformanceReporter } from './performance-analyzer'
import { BulkPerfChecker } from './bulk-perf-check'
import { QuickPerfChecker } from './quick-perf-check'
import { SimplePerformanceChecker } from './simple-perf-check'
import { CIPerformanceChecker } from './ci-performance-check'

const program = new Command()

program
  .name('react-performanalyzer')
  .description('🔍 A comprehensive React performance analysis tool')
  .version('1.0.0')
  .usage('[command] [options]')
  .addHelpText('after', `
Examples:
  $ react-performanalyzer analyze src/App.tsx
  $ react-performanalyzer quick src/components/Button.tsx --verbose
  $ react-performanalyzer bulk src/ --extensions .ts,.tsx --output report.json
  $ react-performanalyzer simple src/App.tsx --fix-suggestions
  $ react-performanalyzer interactive

For more information, visit: https://github.com/mohamadgarmabi/react-performanalyzer
  `)

// Global options
program
  .option('-v, --verbose', 'Enable verbose output')
  .option('--no-color', 'Disable colored output')
  .option('-o, --output <file>', 'Save results to file (JSON format)')
  .option('--fix-suggestions', 'Show automatic fix suggestions')

// Main analyze command
program
  .command('analyze <file>')
  .alias('a')
  .description('🔍 Analyze a single file for performance issues')
  .option('-d, --detailed', 'Show detailed analysis with line-by-line breakdown')
  .option('-s, --severity <level>', 'Filter by severity level (high|medium|low)', 'all')
  .option('--ignore-patterns <patterns>', 'Ignore specific patterns (comma-separated)')
  .action(async (file: string, options: any) => {
    try {
      if (!options.color) {
        chalk.level = 0
      }
      
      console.log(chalk.blue('🔍 React Performance Analyzer'))
      console.log(chalk.gray('Analyzing file for performance issues...\n'))
      
      const analyzer = new PerformanceAnalyzer()
      const reporter = new PerformanceReporter()
      
      const analysis = analyzer.analyzeFile(file)
      
      if (options.verbose) {
        console.log(chalk.cyan('📋 Analysis Details:'))
        console.log(`   File: ${analysis.filePath}`)
        console.log(`   Total Lines: ${analysis.issues.length}`)
        console.log(`   Issues Found: ${analysis.summary.totalIssues}`)
      }
      
      reporter.printAnalysis(analysis)
      
      if (options.output) {
        const fs = require('fs')
        fs.writeFileSync(options.output, JSON.stringify(analysis, null, 2))
        console.log(chalk.green(`\n💾 Results saved to: ${options.output}`))
      }
      process.exit(0)
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : error)
      process.exit(1)
    }
  })

// Quick check command
program
  .command('quick <file>')
  .alias('q')
  .description('⚡ Quick performance check of a single file')
  .option('-f, --fast', 'Skip detailed analysis for faster results')
  .option('--only-critical', 'Show only critical issues')
  .action(async (file: string, options: any) => {
    try {
      if (!options.color) {
        chalk.level = 0
      }
      
      console.log(chalk.blue('⚡ Quick Performance Check'))
      console.log(chalk.gray('Fast analysis of common performance issues...\n'))
      
      const checker = new QuickPerfChecker()
      checker.checkFile(file)
      
      if (options.verbose) {
        console.log(chalk.cyan('\n📊 Quick Analysis Summary:'))
        console.log('   - Memory leak detection')
        console.log('   - Performance pattern analysis')
        console.log('   - React-specific optimizations')
      }
      process.exit(0)
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : error)
      process.exit(1)
    }
  })

// Simple check command
program
  .command('simple <file>')
  .alias('s')
  .description('📝 Simple performance check with basic analysis')
  .option('--basic-only', 'Show only basic issues (no React-specific)')
  .option('--format <format>', 'Output format (text|json|table)', 'text')
  .action(async (file: string, options: any) => {
    try {
      if (!options.color) {
        chalk.level = 0
      }
      
      console.log(chalk.blue('📝 Simple Performance Check'))
      console.log(chalk.gray('Basic analysis of performance issues...\n'))
      
      const checker = new SimplePerformanceChecker()
      checker.checkFile(file)
      
      if (options.verbose) {
        console.log(chalk.cyan('\n📋 Simple Check Features:'))
        console.log('   - Array operation analysis')
        console.log('   - Memory leak detection')
        console.log('   - React component optimization')
        console.log('   - Code quality suggestions')
      }
      process.exit(0)
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : error)
      process.exit(1)
    }
  })

// Bulk check command
program
  .command('bulk <directory>')
  .alias('b')
  .description('📁 Analyze entire directory for performance issues')
  .option('-e, --extensions <extensions>', 'File extensions to check (comma-separated)', '.ts,.tsx,.js,.jsx')
  .option('--exclude <patterns>', 'Exclude files/directories (comma-separated)', 'node_modules,.git,dist,build')
  .option('--max-files <number>', 'Maximum number of files to analyze', '1000')
  .option('--parallel <number>', 'Number of parallel processes', '4')
  .option('--summary-only', 'Show only summary, not individual file details')
  .action(async (directory: string, options: any) => {
    try {
      if (!options.color) {
        chalk.level = 0
      }
      
      console.log(chalk.blue('📁 Bulk Performance Check'))
      console.log(chalk.gray('Scanning entire directory for performance issues...\n'))
      
      if (options.verbose) {
        console.log(chalk.cyan('🔧 Configuration:'))
        console.log(`   Directory: ${directory}`)
        console.log(`   Extensions: ${options.extensions}`)
        console.log(`   Exclude: ${options.exclude}`)
        console.log(`   Max Files: ${options.maxFiles}`)
        console.log(`   Parallel: ${options.parallel}`)
      }
      
      const extensions = options.extensions.split(',').map((ext: string) => ext.trim())
      const excludePatterns = options.exclude.split(',').map((pattern: string) => pattern.trim())
      
      const checker = new BulkPerfChecker()
      checker.checkDirectory(directory, extensions)
      
      if (options.output) {
        const fs = require('fs')
        const results = {
          directory,
          timestamp: new Date().toISOString(),
          configuration: {
            extensions,
            excludePatterns,
            maxFiles: options.maxFiles,
            parallel: options.parallel
          }
        }
        fs.writeFileSync(options.output, JSON.stringify(results, null, 2))
        console.log(chalk.green(`\n💾 Results saved to: ${options.output}`))
      }
      process.exit(0)
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : error)
      process.exit(1)
    }
  })

// Interactive mode
program
  .command('interactive')
  .alias('i')
  .description('🎯 Interactive mode for analyzing files')
  .option('--guided', 'Show guided tour for first-time users')
  .action(async (options: any) => {
    try {
      if (!options.color) {
        chalk.level = 0
      }
      
      console.log(chalk.blue('🎯 Interactive React Performance Checker'))
      console.log(chalk.gray('Choose your analysis mode...\n'))
      
      if (options.guided) {
        console.log(chalk.yellow('🎓 Guided Tour:'))
        console.log('   This tool helps you find performance issues in your React code.')
        console.log('   Choose the analysis mode that best fits your needs:\n')
      }
      
      const readline = require('readline')
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })

      const question = (query: string): Promise<string> => {
        return new Promise((resolve) => {
          rl.question(query, resolve)
        })
      }

      console.log(chalk.yellow('📋 Available modes:'))
      console.log('1. 🔍 Full Analysis (detailed report with scoring)')
      console.log('2. ⚡ Quick Check (fast analysis of common issues)')
      console.log('3. 📝 Simple Check (basic analysis for beginners)')
      console.log('4. 📁 Bulk Check (entire directory analysis)')
      console.log('5. 🚀 Auto-fix (suggest automatic fixes)')
      
      const mode = await question('\n🎯 Select mode (1-5): ')
      const filePath = await question('📁 Enter file/directory path: ')
      
      const saveResults = await question('💾 Save results to file? (y/N): ')
      const outputFile = saveResults.toLowerCase() === 'y' ? await question('📄 Output file name: ') : null
      
      rl.close()

      if (!filePath) {
        console.log(chalk.red('❌ No path provided'))
        return
      }

      switch (mode) {
        case '1':
          const analyzer = new PerformanceAnalyzer()
          const reporter = new PerformanceReporter()
          const analysis = analyzer.analyzeFile(filePath)
          reporter.printAnalysis(analysis)
          if (outputFile) {
            const fs = require('fs')
            fs.writeFileSync(outputFile, JSON.stringify(analysis, null, 2))
            console.log(chalk.green(`\n💾 Results saved to: ${outputFile}`))
          }
          break
        case '2':
          const quickChecker = new QuickPerfChecker()
          quickChecker.checkFile(filePath)
          break
        case '3':
          const simpleChecker = new SimplePerformanceChecker()
          simpleChecker.checkFile(filePath)
          break
        case '4':
          const bulkChecker = new BulkPerfChecker()
          bulkChecker.checkDirectory(filePath)
          break
        case '5':
          console.log(chalk.blue('🚀 Auto-fix Mode'))
          console.log(chalk.gray('This feature is coming soon!'))
          console.log(chalk.yellow('For now, use the analysis modes to get suggestions.'))
          break
        default:
          console.log(chalk.red('❌ Invalid mode selected'))
      }
      process.exit(0)
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : error)
      process.exit(1)
    }
  })

// New command: Auto-fix suggestions
program
  .command('fix <file>')
  .alias('f')
  .description('🔧 Show automatic fix suggestions for a file')
  .option('--apply', 'Apply fixes automatically (experimental)')
  .option('--backup', 'Create backup before applying fixes')
  .action(async (file: string, options: any) => {
    try {
      if (!options.color) {
        chalk.level = 0
      }
      
      console.log(chalk.blue('🔧 Auto-fix Suggestions'))
      console.log(chalk.gray('Analyzing file for fixable issues...\n'))
      
      const analyzer = new PerformanceAnalyzer()
      const analysis = analyzer.analyzeFile(file)
      
      console.log(chalk.yellow('🔧 Fixable Issues Found:'))
      let fixableCount = 0
      
      analysis.issues.forEach((issue: any, index: number) => {
        if (issue.severity === 'high' || issue.severity === 'medium') {
          fixableCount++
          console.log(`\n${index + 1}. Line ${issue.line}: ${issue.message}`)
          console.log(`   💡 Fix: ${issue.suggestion}`)
          
          if (options.apply) {
            console.log(chalk.green('   ✅ Would apply fix automatically'))
          }
        }
      })
      
      if (fixableCount === 0) {
        console.log(chalk.green('✅ No automatically fixable issues found'))
      } else {
        console.log(chalk.cyan(`\n📊 Found ${fixableCount} fixable issues`))
        if (!options.apply) {
          console.log(chalk.yellow('💡 Use --apply flag to automatically apply fixes'))
        }
      }
      process.exit(0)
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : error)
      process.exit(1)
    }
  })

// New command: Project health check
program
  .command('health <directory>')
  .alias('h')
  .description('🏥 Overall project health assessment')
  .option('--score-threshold <number>', 'Minimum score to pass (0-100)', '70')
  .option('--generate-report', 'Generate detailed health report')
  .action(async (directory: string, options: any) => {
    try {
      if (!options.color) {
        chalk.level = 0
      }
      
      console.log(chalk.blue('🏥 Project Health Assessment'))
      console.log(chalk.gray('Analyzing overall project health...\n'))
      
      const checker = new BulkPerfChecker()
      checker.checkDirectory(directory)
      
      console.log(chalk.green('\n✅ Health check completed!'))
      console.log(chalk.cyan('💡 Use --generate-report for detailed analysis'))
      process.exit(0)
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : error)
      process.exit(1)
    }
  })

// CI Performance Check command
program
  .command('ci')
  .description('🚀 CI/CD performance check with snapshot comparison and PR alerts')
  .option('--baseline-branch <branch>', 'Branch to compare against', 'main')
  .option('--snapshots-dir <dir>', 'Directory to store snapshots', '.performance-snapshots')
  .option('--max-score-regression <num>', 'Maximum allowed score regression', '5')
  .option('--max-high-severity-increase <num>', 'Maximum allowed high severity issues increase', '2')
  .option('--max-total-issues-increase <num>', 'Maximum allowed total issues increase', '10')
  .option('--min-score-improvement <num>', 'Minimum score improvement to highlight', '2')
  .option('--output <formats>', 'Output formats: console,json,github-comment', 'console')
  .option('--no-fail-on-regression', 'Don\'t fail CI on performance regression')
  .option('--no-warn-on-regression', 'Don\'t warn on performance regression')
  .action(async (options: any) => {
    try {
      if (!options.color) {
        chalk.level = 0
      }
      
      console.log(chalk.blue('🚀 CI Performance Check'))
      console.log(chalk.gray('Running performance analysis for CI/CD...\n'))
      
      const config = {
        baselineBranch: options.baselineBranch,
        snapshotsDir: options.snapshotsDir,
        thresholds: {
          maxScoreRegression: Number(options.maxScoreRegression),
          maxHighSeverityIncrease: Number(options.maxHighSeverityIncrease),
          maxTotalIssuesIncrease: Number(options.maxTotalIssuesIncrease),
          minScoreImprovement: Number(options.minScoreImprovement)
        },
        outputFormats: options.output.split(','),
        failOnRegression: !options.noFailOnRegression,
        warnOnRegression: !options.noWarnOnRegression
      }
      
      const checker = new CIPerformanceChecker(config)
      await checker.run()
      
      process.exit(0)
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : error)
      process.exit(1)
    }
  })

program.parse()

// Exit after parsing if no command was executed
if (process.argv.length <= 2) {
  process.exit(0)
} 