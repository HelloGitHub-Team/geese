[中文](content.md) | [English](content_en.md) | 日本語

## 開発を始める前に

まず、プロジェクトはyarnをパッケージインストール用に使用しています。yarnを自身でインストールしてください。インストール完了後、`yarn set version v1.22.19`コマンドでバージョンを設定します。

次に、'Geese'プロジェクトをローカルで実行するには、以下の手順に従ってください：

1. プロジェクトのクローン: `git clone git@github.com:HelloGitHub-Team/geese.git`
2. 依存関係のインストール: `yarn install`
3. プロジェクトの実行: `yarn dev`
4. ブラウザでアクセス: `http://localhost:3000/`

起動後に遭遇する可能性のある問題：

1. CORS問題: フロントエンドサービスがポート`3000`で、ホストが`localhost`または`127.0.0.1`で起動していることを確認してください。
2. 画像が表示されない: ローカルのhostsファイルの末尾に`127.0.0.1 dev.hg.com`を追加し、`http://dev.hg.com:3000/`でアクセスしてください。
3. ログイン状態: @521xueweihanからテスト環境のログイントークンを取得し、ブラウザのLocalStorageにAuthorization: tokenアイテムを手動で追加してください。
4. ビルド中にマシンがフリーズする場合: yarnで同時実行数を設定することで解決できます: `yarn config set cloneConcurrency 1`

**技術スタック**

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [SWR](https://swr.vercel.app/ja)
- スキャフォールド: [ts-nextjs-tailwind-starter](https://github.com/theodorusclarence/ts-nextjs-tailwind-starter)
- コンポーネントスタイル: [hyperui](https://github.com/markmead/hyperui)

最後に、APIドキュメントは[こちら](https://frp.hellogithub.com/docs#)で確認できます。

プロジェクトを実行できたら、ローカルで試してみてください。興味を持った場合は、[こちら](https://github.com/orgs/HelloGitHub-Team/projects/1/views/1)をクリックして未割り当ての要件を確認し、興味のある機能、バグ、または最適化を見つけ、開発を始める前に対応するissuesで@521xueweihanに「タスクを引き受けます」と伝えて、**重複開発を防いでください**。

## 開発中

これは共同開発であるため、`main`ブランチは継続的に更新される可能性があります。各開発セッションの前に、最新のコードをプルして、最新の`main`ブランチに基づいて開発していることを確認する必要があります。

特定の要件を開発する際は、コードを対応するディレクトリに分割してください：

- コンポーネント: `components`ディレクトリ
- ページ: `pages`ディレクトリ
- データ定義: `types`ディレクトリ
- リクエスト: `services`ディレクトリ

機能開発/バグ修正の完了後、セルフテスト、コードスタイルのチェック、コードの再利用性の向上を行う必要があります。

最後に、以下のコマンドをローカルで実行し、可能な限り**警告**を解決してください：

- `yarn lint:fix`
- `yarn lint`
- `yarn typecheck`

## 開発後

最新の`main`ブランチコードを取得し、ローカルで競合を解決してください。

最初のコード提出は、PR（Pull Request）を通じて行う必要があります。

コードが正常にマージされた後、@521xueweihanが'Geese'プロジェクトのメンバーとして招待します。GitHubの通知メールを確認してください。

その後のコード提出は、'自己作成ブランチ'または'要件の引き受け時に自動作成されるブランチ'で開発できます。

コードを提出した後は、プロジェクトの**issues**と**prs**の通知に注意を払ってください。提出されたコードをレビューした後、フィードバックと最適化の提案を提供します。

## 最後に

皆さんと'Geese'を構築できることを嬉しく思います。コード貢献のプロセスから何かを得ていただければ幸いです。